'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import EmptyState from '@/components/ui/EmptyState'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

interface OrientationResponse {
  id: string
  level: string
  country: string
  objectives: string
  profile: string
  score: number
  createdAt: string
}

export default function StudentOrientationPage() {
  const [orientations, setOrientations] = useState<OrientationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrientations()
  }, [])

  const fetchOrientations = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orientation/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Erreur lors du chargement de vos orientations')
      }

      const data = await res.json()
      setOrientations(data || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de vos orientations')
    } finally {
      setLoading(false)
    }
  }

  const getLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      'bac': 'Baccalauréat',
      'bac+2': 'Bac+2',
      'bac+3': 'Bac+3',
      'bac+5': 'Bac+5'
    }
    return levels[level] || level
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement de vos orientations..." />
  }

  return (
    <div className="max-w-7xl mx-auto animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Mon Orientation' },
        ]}
        className="mb-6"
      />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mon Orientation</h1>
          <p className="mt-2 text-gray-600">Consultez l&apos;historique de vos orientations</p>
        </div>
        <Link
          href="/dashboard/student/orientation/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Nouvelle orientation
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onClose={() => setError('')} />
        </div>
      )}

      {orientations.length === 0 ? (
        <EmptyState
          title="Aucune orientation"
          description="Vous n'avez pas encore complété d'orientation. Commencez dès maintenant !"
          action={{
            label: "Faire mon orientation",
            onClick: () => window.location.href = "/dashboard/student/orientation/new"
          }}
        />
      ) : (
        <div className="space-y-6">
          {orientations.map((orientation) => (
            <Link href={`/dashboard/student/orientation/${orientation.id}`} key={orientation.id} className="block group">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-electric-200 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-electric-600 transition-colors">
                      Orientation du {new Date(orientation.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {getLevelLabel(orientation.level)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {orientation.country}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-semibold">
                        Score: {orientation.score}%
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-electric-50 group-hover:text-electric-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Objectifs</h3>
                    <p className="text-gray-600 whitespace-pre-wrap line-clamp-2">{orientation.objectives}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Profil</h3>
                    <p className="text-gray-600 whitespace-pre-wrap line-clamp-2">{orientation.profile}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
