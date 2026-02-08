const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, requirePremium } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Constants
const SUBSCRIPTION_TIERS = {
  STARTER: 29900,   // 299.00 EUR
  PREMIUM: 60000,   // 600.00 EUR
  ENTERPRISE: 99900 // 999.00 EUR
}

const VALID_AMOUNTS = Object.values(SUBSCRIPTION_TIERS)

// Create payment intent
router.post('/create-intent', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body
    const amountInCents = Math.round(amount * 100)

    // Security: Strict amount validation
    if (!VALID_AMOUNTS.includes(amountInCents)) {
      return res.status(400).json({ message: 'Montant invalide. Veuillez choisir un forfait valide.' })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      metadata: {
        userId: req.user.id,
        tier: getTierName(amountInCents)
      },
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountInCents,
    })
  } catch (error) {
    console.error('Create payment intent error:', error)
    res.status(500).json({ message: 'Erreur lors de la création du paiement' })
  }
})

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'payment_intent.succeeded') {
    await handlePaymentSuccess(event.data.object)
  }

  res.json({ received: true })
})

// --- Helpers ---

const getTierName = (amount) => {
  return Object.keys(SUBSCRIPTION_TIERS).find(key => SUBSCRIPTION_TIERS[key] === amount) || 'UNKNOWN'
}

async function handlePaymentSuccess(paymentIntent) {
  try {
    // 1. Double-check amount for security
    if (!VALID_AMOUNTS.includes(paymentIntent.amount)) {
      console.warn(`⚠️ Suspicious payment amount: ${paymentIntent.amount} - User: ${paymentIntent.metadata.userId}`)
      return
    }

    // 2. Atomic update
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          userId: paymentIntent.metadata.userId,
          amount: paymentIntent.amount / 100,
          stripeId: paymentIntent.id,
          status: 'completed',
        },
      }),
      prisma.user.update({
        where: { id: paymentIntent.metadata.userId },
        data: { isPremium: true },
      })
    ])

    console.log(`✅ Payment processed for user ${paymentIntent.metadata.userId}`)
  } catch (error) {
    console.error('❌ Error processing payment success:', error)
  }
}

// Get user payments
router.get('/my-payments', authenticateToken, async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    })

    res.json(payments)
  } catch (error) {
    console.error('Get payments error:', error)
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements' })
  }
})

module.exports = router




