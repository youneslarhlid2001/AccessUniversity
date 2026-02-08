'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

interface Package {
  id: string
  name: string
  price: number | null
  priceText?: string
  description: string
  features: string[]
  platform: string
  tag?: string
  buttonText: string
  buttonVariant: 'primary' | 'secondary' | 'disabled'
}

const fallbackPackages: Package[] = [
  {
    id: 'starter',
    name: 'Starter plan',
    platform: 'via AccessUniversity Access',
    price: 0,
    description: 'Parfait pour commencer vos recherches sans engagement.',
    features: [
      'Accès limité aux écoles',
      'Recherche basique',
      'Support par communauté',
      'Alertes email mensuelles'
    ],
    buttonText: 'Commencer gratuitement',
    buttonVariant: 'secondary'
  },
  {
    id: 'student',
    name: 'Student plan',
    platform: 'via AccessUniversity Premium',
    price: 299,
    description: "L'essentiel pour constituer un dossier solide.",
    features: [
      'Accès complet aux écoles',
      'Upload de documents (5GB)',
      'Support par email prioritaire',
      'Guide de rédaction CV',
      'Webinaires exclusifs'
    ],
    tag: 'Populaire',
    buttonText: "S'abonner",
    buttonVariant: 'primary'
  },
  {
    id: 'expert',
    name: 'Expert plan',
    platform: 'via AccessUniversity Elite',
    price: 600,
    description: 'Un accompagnement sur-mesure pour viser l\'excellence.',
    features: [
      'Mentor dédié (1h/mois)',
      'Revue de dossier illimitée',
      'Simulation d\'entretien',
      'Garantie "Satisfait ou Remboursé"',
      'Accès anticipé aux bourses'
    ],
    tag: 'Recommandé',
    buttonText: "Choisir l'excellence",
    buttonVariant: 'secondary'
  },
  {
    id: 'enterprise',
    name: 'Institutions',
    platform: 'Pour les écoles et agences',
    priceText: 'Sur devis',
    price: null,
    description: 'Solutions de recrutement pour les établissements.',
    features: [
      'Portfolio d\'étudiants vérifiés',
      'Outils de matching IA',
      'Tableau de bord analytics',
      'API access'
    ],
    tag: 'Professionnels',
    buttonText: 'Contacter les ventes',
    buttonVariant: 'disabled'
  }
]

// Payment Form Component
function CheckoutForm({ selectedPackage, onCancel }: { selectedPackage: Package, onCancel: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    // Simulate sucess for demo purposes if no API
    setTimeout(() => {
      setLoading(false)
      router.push('/dashboard/student?payment=success')
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold font-display">Paiement sécurisé</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="mb-8">
          <div className="text-sm text-slate-500 mb-1">Vous avez choisi</div>
          <div className="text-xl font-bold">{selectedPackage.name}</div>
          <div className="text-3xl font-bold mt-2">{selectedPackage.price !== null ? selectedPackage.price + '€' : selectedPackage.priceText}<span className="text-sm font-normal text-slate-500">/an</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 border rounded-xl bg-slate-50">
            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            disabled={!stripe || loading}
            className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Traitement...' : 'Confirmer le paiement'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default function PaymentPage() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [packages, setPackages] = useState<Package[]>([])

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/pricing`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setPackages(data.length > 0 ? data : fallbackPackages)
      } catch (e) {
        setPackages(fallbackPackages)
      }
    }
    fetchPricing()
  }, [])

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-900">

      {/* Background Texture (Confetti-like subtle dots) */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
      }}></div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 text-center max-w-5xl mx-auto z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold tracking-tight mb-6 font-display text-slate-900"
        >
          Choisissez le plan parfait pour <br /> votre avenir.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-slate-500 max-w-2xl mx-auto"
        >
          Des solutions flexibles adaptées à chaque étape de votre parcours d'admission international.
        </motion.p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-[1400px] mx-auto px-6 pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.length === 0 ? (
            // Loading State
            [1, 2, 3, 4].map(i => <div key={i} className="h-[500px] bg-slate-100 rounded-[32px] animate-pulse"></div>)
          ) : (
            packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex flex-col bg-slate-50/80 backdrop-blur-sm rounded-[32px] p-8 hover:bg-white transition-colors duration-300 border border-transparent hover:border-slate-100"
              >
                {/* Top Badge */}
                <div className="h-8 mb-4">
                  {pkg.tag && (
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-200/60 text-slate-700 text-xs font-bold tracking-wide uppercase">
                      {pkg.tag}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{pkg.name}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-6">{pkg.platform}</p>

                  <div className="flex items-baseline mb-2">
                    {pkg.price !== null ? (
                      <>
                        <span className="text-4xl font-bold text-slate-900">${pkg.price}</span>
                        <span className="text-slate-500 ml-1">/an</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-slate-900">{pkg.priceText}</span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed min-h-[40px]">
                    {pkg.description}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-slate-200 mb-8"></div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-grow">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-slate-800 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-sm text-slate-600 leading-tight pt-0.5">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  onClick={() => {
                    if (pkg.buttonVariant !== 'disabled') {
                      setSelectedPackage(pkg)
                    } else {
                      window.location.href = '/contact'
                    }
                  }}
                  className={`w-full py-4 rounded-full font-bold text-sm transition-all duration-200 ${pkg.buttonVariant === 'primary'
                    ? 'bg-slate-900 text-white hover:bg-black hover:scale-[1.02]'
                    : pkg.buttonVariant === 'secondary'
                      ? 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-300'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  {pkg.buttonText}
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPackage && (
        <Elements stripe={stripePromise}>
          <CheckoutForm selectedPackage={selectedPackage} onCancel={() => setSelectedPackage(null)} />
        </Elements>
      )}

    </div>
  )
}
