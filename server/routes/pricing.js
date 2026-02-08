const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all pricing plans
router.get('/', async (req, res) => {
    try {
        const plans = await prisma.pricingPlan.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        })
        res.json(plans)
    } catch (error) {
        console.error('Get Pricing Plans error:', error)
        res.status(500).json({ message: 'Erreur lors de la récupération des prix' })
    }
})

// Admin: Create Plan
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { key, name, price, description, features, buttonText, buttonVariant, order } = req.body
        const plan = await prisma.pricingPlan.create({
            data: {
                key,
                name,
                price: parseFloat(price),
                description,
                features: features || [],
                buttonText,
                buttonVariant,
                order: order || 0
            }
        })
        res.status(201).json(plan)
    } catch (error) {
        res.status(400).json({ message: 'Erreur création plan', error })
    }
})

module.exports = router
