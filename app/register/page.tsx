'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ErrorMessage from '@/components/ui/ErrorMessage'
import FormField from '@/components/ui/FormField'
import SuccessToast from '@/components/ui/SuccessToast'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation côté client
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError('Veuillez remplir tous les champs obligatoires')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('Format d\'email invalide. Utilisez un format comme exemple@email.com')
        return
      }

      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères')
        return
      }

      // Timeout pour la requête
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await res.json()

      if (!res.ok) {
        // Messages d'erreur spécifiques
        let errorMessage = 'Erreur lors de l\'inscription'
        if (res.status === 400 && data.message?.includes('déjà utilisé')) {
          errorMessage = 'Cet email est déjà utilisé. Connectez-vous ou utilisez un autre email.'
        } else if (res.status === 400) {
          errorMessage = data.message || 'Vérifiez que tous les champs sont correctement remplis.'
        } else if (res.status >= 500) {
          errorMessage = 'Le serveur rencontre des difficultés. Veuillez réessayer dans quelques instants.'
        } else if (data.message) {
          errorMessage = data.message
        }
        throw new Error(errorMessage)
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setShowSuccess(true)
      
      setTimeout(() => {
        router.push('/dashboard/student')
      }, 1500)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('La connexion prend trop de temps. Vérifiez votre connexion internet et réessayez.')
      } else {
        setError(err.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-gold-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gold-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo et titre */}
        <div className="text-center mb-8 animate-fade-in">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">AU</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              AccèsUniversity
            </span>
          </Link>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Inscription</h2>
          <p className="text-gray-600">Créez votre compte gratuitement</p>
        </div>

        {/* Card avec glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 animate-scale-in">
          {error && (
            <ErrorMessage 
              message={error} 
              onClose={() => setError('')}
              autoClose={false}
            />
          )}

          {showSuccess && (
            <SuccessToast 
              message="Inscription réussie ! Redirection en cours..." 
              onClose={() => setShowSuccess(false)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Prénom"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
                validation={(value) => {
                  if (!value) return 'Le prénom est requis'
                  if (value.length < 2) return 'Le prénom doit contenir au moins 2 caractères'
                  return null
                }}
              />
              <FormField
                label="Nom"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
                validation={(value) => {
                  if (!value) return 'Le nom est requis'
                  if (value.length < 2) return 'Le nom doit contenir au moins 2 caractères'
                  return null
                }}
              />
            </div>

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
              validation={(value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!value) return 'L\'email est requis'
                if (!emailRegex.test(value)) return 'Format d\'email invalide (ex: exemple@email.com)'
                return null
              }}
              helpText="Nous ne partagerons jamais votre email"
            />

            <FormField
              label="Téléphone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+33 6 12 34 56 78"
              validation={(value) => {
                if (value && !/^\+?[\d\s-()]+$/.test(value)) {
                  return 'Format de téléphone invalide'
                }
                return null
              }}
              helpText="Optionnel - Format: +33 6 12 34 56 78"
            />

            <FormField
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              validation={(value) => {
                if (!value) return 'Le mot de passe est requis'
                if (value.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères'
                return null
              }}
              helpText="Minimum 6 caractères"
            />

            <button
              type="submit"
              disabled={loading || !formData.email || !formData.password || !formData.firstName || !formData.lastName}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              aria-label={loading ? 'Inscription en cours...' : 'Créer mon compte'}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Inscription en cours...</span>
                </>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
