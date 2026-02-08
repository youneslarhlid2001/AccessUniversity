'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessToast from '@/components/ui/SuccessToast'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

interface School {
  id: string
  name: string
  description: string
  country: string
  city?: string
  program: string
  price?: number
  imageUrl?: string
  website?: string
}

interface Recommendation {
  id: string
  score: number
}

export default function DashboardSchoolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [school, setSchool] = useState<School | null>(null)
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isInterested, setIsInterested] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<'none' | 'interested' | 'applied' | 'in_progress' | 'accepted' | 'rejected'>('none')
  const [notes, setNotes] = useState('')
  const [applicationId, setApplicationId] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchSchoolData(params.id as string)
    }
  }, [params.id])

  const fetchSchoolData = async (id: string) => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      // Récupérer les données de l'école
      const schoolRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/schools/${id}`)
      if (!schoolRes.ok) {
        throw new Error('École non trouvée')
      }
      const schoolData = await schoolRes.json()
      setSchool(schoolData)

      // Récupérer la recommandation si elle existe
      const dashboardRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/dashboard/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json()
        const rec = dashboardData.recommendations?.find((r: any) => r.school.id === id)
        if (rec) {
          setRecommendation(rec)
        }
      }

      // Récupérer le statut de candidature depuis l'API
      const applicationRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications/school/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (applicationRes.ok) {
        const application = await applicationRes.json()
        if (application) {
          setApplicationStatus(application.status as any)
          setIsInterested(true)
          setApplicationId(application.id)
          if (application.notes) {
            setNotes(application.notes)
          }
        }
      }

      // Vérifier si l'école est dans les favoris
      const favoriteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/favorites/check/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (favoriteRes.ok) {
        const favoriteData = await favoriteRes.json()
        setIsFavorite(favoriteData.isFavorite)
      }

    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'école')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkInterested = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schoolId: school?.id,
          status: 'interested',
        }),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de l\'enregistrement')
      }

      const application = await res.json()
      setIsInterested(true)
      setApplicationStatus('interested')
      setApplicationId(application.id)
      setSuccess('École ajoutée à vos candidatures')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const handleUpdateStatus = async (status: typeof applicationStatus) => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      // Récupérer l'application existante
      const appRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications/school/${school?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (appRes.ok) {
        const application = await appRes.json()
        if (application) {
          // Mettre à jour l'application existante
          const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications/${application.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
          })

          if (!updateRes.ok) {
            throw new Error('Erreur lors de la mise à jour')
          }
        } else {
          // Créer une nouvelle application
          const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              schoolId: school?.id,
              status,
            }),
          })

          if (!createRes.ok) {
            throw new Error('Erreur lors de la création')
          }
        }
      }

      setApplicationStatus(status)
      setSuccess('Statut mis à jour avec succès')
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour')
    }
  }

  const handleToggleFavorite = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      if (isFavorite) {
        // Retirer des favoris
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/favorites/${school?.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Erreur lors de la suppression')
        }

        setIsFavorite(false)
        setSuccess('Retiré des favoris')
      } else {
        // Ajouter aux favoris
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ schoolId: school?.id }),
        })

        if (!res.ok) {
          throw new Error('Erreur lors de l\'ajout')
        }

        setIsFavorite(true)
        setSuccess('Ajouté aux favoris')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour des favoris')
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement des informations de l'école..." />
  }

  if (error && !school) {
    return (
      <div className="max-w-7xl mx-auto">
        <ErrorMessage message={error} onClose={() => router.push('/dashboard/student/ecoles')} />
      </div>
    )
  }

  if (!school) {
    return null
  }

  const statusLabels = {
    none: 'Aucun statut',
    interested: 'Intéressé',
    applied: 'Candidature envoyée',
    in_progress: 'En cours de traitement',
    accepted: 'Accepté',
    rejected: 'Refusé'
  }

  const statusColors = {
    none: 'bg-gray-100 text-gray-600',
    interested: 'bg-blue-100 text-blue-600',
    applied: 'bg-yellow-100 text-yellow-600',
    in_progress: 'bg-purple-100 text-purple-600',
    accepted: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600'
  }

  return (
    <div className="max-w-7xl mx-auto animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Mes Écoles', href: '/dashboard/student/ecoles' },
          { label: school.name },
        ]}
        className="mb-6"
      />

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

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        {school.imageUrl ? (
          <div className="h-64 w-full overflow-hidden bg-gray-100">
            <img
              src={school.imageUrl}
              alt={school.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-64 w-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <svg className="w-32 h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{school.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{school.city ? `${school.city}, ` : ''}{school.country}</span>
                    </div>
                    {school.price && (
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(school.price)}/an</span>
                      </div>
                    )}
                  </div>
                </div>
                {recommendation && (
                  <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium mb-1">Score de compatibilité</div>
                    <div className="text-2xl font-bold text-blue-600">{recommendation.score}%</div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isFavorite
                    ? 'bg-accent-50 text-accent-600 border border-accent-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isFavorite ? 'Favori' : 'Ajouter aux favoris'}</span>
              </button>
              {!isInterested && (
                <button
                  onClick={handleMarkInterested}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Je suis intéressé
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statut de candidature */}
      {isInterested && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Suivi de candidature</h2>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusColors[applicationStatus]}`}>
              {statusLabels[applicationStatus]}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => handleUpdateStatus('applied')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                applicationStatus === 'applied'
                  ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Candidature envoyée
            </button>
            <button
              onClick={() => handleUpdateStatus('in_progress')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                applicationStatus === 'in_progress'
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En cours de traitement
            </button>
            <button
              onClick={() => handleUpdateStatus('accepted')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                applicationStatus === 'accepted'
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Accepté
            </button>
            <button
              onClick={() => handleUpdateStatus('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                applicationStatus === 'rejected'
                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Refusé
            </button>
          </div>
          
          {/* Notes personnelles */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes personnelles
            </label>
            <textarea
              placeholder="Ajoutez vos notes sur cette école..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={async (e) => {
                try {
                  setError('')
                  const token = localStorage.getItem('token')
                  
                  if (applicationId) {
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications/${applicationId}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ notes: e.target.value }),
                    })
                  } else if (school?.id) {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        schoolId: school.id,
                        status: 'interested',
                        notes: e.target.value,
                      }),
                    })
                    if (res.ok) {
                      const newApp = await res.json()
                      setApplicationId(newApp.id)
                      setIsInterested(true)
                      setApplicationStatus('interested')
                    }
                  }
                } catch (err) {
                  console.error('Error saving notes:', err)
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Ces notes sont privées et uniquement visibles par vous</p>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
              {school.description}
            </div>
          </div>

          {/* Programme */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Programme</h2>
            <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
              {school.program}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Informations clés */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Pays</div>
                <div className="font-semibold text-gray-900">{school.country}</div>
              </div>
              {school.city && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Ville</div>
                  <div className="font-semibold text-gray-900">{school.city}</div>
                </div>
              )}
              {school.price && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Frais de scolarité</div>
                  <div className="font-semibold text-gray-900">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(school.price)}/an
                  </div>
                </div>
              )}
              {school.website && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Site web</div>
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium break-all"
                  >
                    {school.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard/student/documents"
                className="block w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-center"
              >
                Voir mes documents
              </Link>
              <Link
                href="/dashboard/student/orientation"
                className="block w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-center"
              >
                Voir mon orientation
              </Link>
              {school.website && (
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
                >
                  Visiter le site de l&apos;école
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

