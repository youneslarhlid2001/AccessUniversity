'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessToast from '@/components/ui/SuccessToast'
import FormField from '@/components/ui/FormField'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  isPremium: boolean
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Erreur lors du chargement du profil')
      }

      const userData = await res.json()
      setProfile(userData)
      setFormData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || '',
      })
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || null,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil')
      }

      const updatedProfile = await res.json()
      setProfile(updatedProfile)
      setSuccess('Profil mis à jour avec succès')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement de votre profil..." />
  }

  if (!profile) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Mon Profil' },
        ]}
        className="mb-6"
      />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="mt-2 text-gray-600">Gérez vos informations personnelles</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onClose={() => setError('')} />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <SuccessToast message={success} onClose={() => setSuccess('')} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              label="Prénom"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <FormField
              label="Nom"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled
            helpText="L'email ne peut pas être modifié"
          />

          <FormField
            label="Téléphone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Statut Premium</h3>
                <p className="text-sm text-gray-600">
                  {profile.isPremium 
                    ? 'Vous bénéficiez de toutes les fonctionnalités premium'
                    : 'Passez à Premium pour débloquer toutes les fonctionnalités'}
                </p>
              </div>
              {profile.isPremium ? (
                <span className="px-4 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg font-semibold">
                  Premium
                </span>
              ) : (
                <Link
                  href="/dashboard/student/paiement"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Passer à Premium
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => fetchProfile()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
