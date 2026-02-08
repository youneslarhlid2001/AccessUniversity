'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import Link from 'next/link'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import ErrorMessage from '@/components/ui/ErrorMessage'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

interface Package {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  icon: React.ReactNode
}

const PremiumIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const packages: Package[] = [
  {
    id: 'premium',
    name: 'Premium',
    price: 600,
    description: 'La solution complète pour votre réussite',
    features: [
      'Tout du Starter',
      'Upload de documents illimité',
      'Suivi de dossier complet',
      'Support prioritaire',
      'Recommandations personnalisées',
      'Accès aux partenaires logement',
    ],
    popular: true,
    icon: <PremiumIcon className="w-8 h-8" />,
  },
]

function CheckoutForm({ selectedPackage }: { selectedPackage: Package }) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Vous devez être connecté pour effectuer un paiement')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/payment/create-intent`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: selectedPackage.price }),
        }
      )

      if (!res.ok) {
        throw new Error('Erreur lors de la création du paiement')
      }

      const { clientSecret } = await res.json()

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      )

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (paymentIntent.status === 'succeeded') {
        router.push('/dashboard/student?payment=success')
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1e293b',
                '::placeholder': {
                  color: '#94a3b8',
                },
              },
              invalid: {
                color: '#dc2626',
              },
            },
          }}
        />
      </div>

      {error && (
        <ErrorMessage message={error} onClose={() => setError('')} />
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? 'Traitement en cours...' : `Payer ${selectedPackage.price}€`}
      </button>
    </form>
  )
}

export default function DashboardPaymentPage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        setIsPremium(user.isPremium || false)
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return null
  }

  if (isPremium) {
    return (
      <div className="max-w-4xl mx-auto animate-page-enter">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard/student' },
            { label: 'Paiement' },
          ]}
          className="mb-6"
        />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vous êtes déjà Premium !</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Vous avez déjà accès à tous les avantages de notre service premium.
          </p>
          <Link
            href="/dashboard/student"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (selectedPackage) {
    return (
      <div className="max-w-2xl mx-auto animate-page-enter">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard/student' },
            { label: 'Paiement', href: '/dashboard/student/paiement' },
            { label: 'Paiement' },
          ]}
          className="mb-6"
        />
        <button
          onClick={() => setSelectedPackage(null)}
          className="mb-6 text-gray-600 hover:text-blue-600 flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux packages
        </button>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 text-white">
              {selectedPackage.icon}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedPackage.name}</h1>
            <p className="text-gray-600 text-lg">{selectedPackage.description}</p>
            <div className="mt-6">
              <span className="text-5xl font-bold text-blue-600">{selectedPackage.price}€</span>
            </div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm selectedPackage={selectedPackage} />
          </Elements>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Paiement' },
        ]}
        className="mb-6"
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Passer à Premium</h1>
        <p className="text-gray-600">
          Accédez à toutes les fonctionnalités avancées et bénéficiez d&apos;un accompagnement personnalisé
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-xl border shadow-lg p-8 flex flex-col ${
              pkg.popular
                ? 'border-blue-600 ring-2 ring-blue-600 scale-105 z-10'
                : 'border-gray-200 hover:shadow-xl transition-shadow'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  Le plus populaire
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                pkg.popular
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {pkg.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">{pkg.price}€</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedPackage(pkg)}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                pkg.popular
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
              }`}
            >
              Choisir {pkg.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

