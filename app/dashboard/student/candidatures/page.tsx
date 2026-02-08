'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import EmptyState from '@/components/ui/EmptyState'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import SuccessToast from '@/components/ui/SuccessToast'

interface Application {
  id: string
  status: string
  notes?: string
  applicationDate?: string
  deadline?: string
  interviewDate?: string
  resultDate?: string
  createdAt: string
  updatedAt: string
  school: {
    id: string
    name: string
    country: string
    city?: string
    imageUrl?: string
  }
}

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Erreur lors du chargement des candidatures')
      }

      const data = await res.json()
      setApplications(data || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des candidatures')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour')
      }

      setSuccess('Statut mis à jour avec succès')
      fetchApplications()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour')
    }
  }

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      return
    }

    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression')
      }

      setSuccess('Candidature supprimée avec succès')
      fetchApplications()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression')
    }
  }

  const statusLabels = {
    interested: 'Intéressé',
    applied: 'Candidature envoyée',
    in_progress: 'En cours de traitement',
    accepted: 'Accepté',
    rejected: 'Refusé'
  }

  const statusColors = {
    interested: 'bg-blue-100 text-blue-600',
    applied: 'bg-yellow-100 text-yellow-600',
    in_progress: 'bg-purple-100 text-purple-600',
    accepted: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600'
  }

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter
    const matchesSearch = search === '' || 
      app.school.name.toLowerCase().includes(search.toLowerCase()) ||
      app.school.country.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: applications.length,
    interested: applications.filter(a => a.status === 'interested').length,
    applied: applications.filter(a => a.status === 'applied').length,
    in_progress: applications.filter(a => a.status === 'in_progress').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement de vos candidatures..." />
  }

  return (
    <div className="max-w-7xl mx-auto animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Mes Candidatures' },
        ]}
        className="mb-6"
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mes Candidatures</h1>
        <p className="mt-2 text-gray-600">Suivez l&apos;état de toutes vos candidatures</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.interested}</div>
          <div className="text-sm text-blue-600">Intéressé</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.applied}</div>
          <div className="text-sm text-yellow-600">Envoyée</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{stats.in_progress}</div>
          <div className="text-sm text-purple-600">En cours</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
          <div className="text-sm text-green-600">Accepté</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-red-600">Refusé</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher une école..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('interested')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'interested' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Intéressé
            </button>
            <button
              onClick={() => setFilter('applied')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'applied' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Envoyée
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'accepted' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Accepté
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Refusé
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          title={applications.length === 0 ? "Aucune candidature" : "Aucune candidature trouvée"}
          description={applications.length === 0 
            ? "Commencez par marquer des écoles comme intéressantes depuis la page Mes Écoles"
            : "Essayez de modifier vos filtres ou votre recherche"}
        />
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {app.school.imageUrl ? (
                      <img
                        src={app.school.imageUrl}
                        alt={app.school.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{app.school.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status as keyof typeof statusColors]}`}>
                          {statusLabels[app.status as keyof typeof statusLabels]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {app.school.city ? `${app.school.city}, ` : ''}{app.school.country}
                      </p>
                      {app.deadline && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Deadline: {new Date(app.deadline).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                      {app.notes && (
                        <p className="text-sm text-gray-600 line-clamp-2">{app.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/dashboard/student/ecoles/${app.school.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    Voir détails
                  </Link>
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    className={`px-4 py-2 rounded-lg font-medium border transition-colors ${statusColors[app.status as keyof typeof statusColors]}`}
                  >
                    <option value="interested">Intéressé</option>
                    <option value="applied">Candidature envoyée</option>
                    <option value="in_progress">En cours de traitement</option>
                    <option value="accepted">Accepté</option>
                    <option value="rejected">Refusé</option>
                  </select>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

