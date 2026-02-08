'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ErrorMessage from '@/components/ui/ErrorMessage'
import FormField from '@/components/ui/FormField'
import SuccessToast from '@/components/ui/SuccessToast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(getErrorMessage(res.status, data.message))
      }

      // TODO: Security - Move to httpOnly cookies to prevent XSS
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setShowSuccess(true)

      // Redirect based on role
      setTimeout(() => {
        const targetPath = data.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/student'
        router.push(targetPath)
      }, 1000)

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('La connexion prend trop de temps. Vérifiez votre connexion internet et réessayez.')
      } else {
        const message = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.'
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  // Helper outside component
  function getErrorMessage(status: number, serverMessage?: string): string {
    if (serverMessage) return serverMessage
    switch (status) {
      case 401: return 'Email ou mot de passe incorrect.'
      case 429: return 'Trop de tentatives. Veuillez patienter.'
      case 500: return 'Erreur serveur. Veuillez réessayer plus tard.'
      default: return 'Erreur de connexion.'
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
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Connexion</h2>
          <p className="text-gray-600">Accédez à votre espace personnel</p>
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
              message="Connexion réussie ! Redirection en cours..."
              onClose={() => setShowSuccess(false)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              validation={(value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!value) return 'L\'email est requis'
                if (!emailRegex.test(value)) return 'Format d\'email invalide (ex: exemple@email.com)'
                return null
              }}
              helpText="Entrez votre adresse email"
            />

            <FormField
              label="Mot de passe"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              aria-label={loading ? 'Connexion en cours...' : 'Se connecter'}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
