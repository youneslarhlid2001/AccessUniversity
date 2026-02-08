'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

interface Stats {
  totalApplications: number
  applicationsByStatus: {
    interested: number
    applied: number
    in_progress: number
    accepted: number
    rejected: number
  }
  totalRecommendations: number
  totalDocuments: number
  orientationsCount: number
  favoriteSchools: number
}

export default function StudentStatisticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const [dashboardRes, applicationsRes, favoritesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/dashboard/student`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const dashboardData = await dashboardRes.json()
      const applications = applicationsRes.ok ? await applicationsRes.json() : []
      const favorites = favoritesRes.ok ? await favoritesRes.json() : []

      // Récupérer toutes les orientations
      const orientationsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orientation/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const orientations = orientationsRes.ok ? await orientationsRes.json() : []

      const applicationsByStatus = {
        interested: applications.filter((a: any) => a.status === 'interested').length,
        applied: applications.filter((a: any) => a.status === 'applied').length,
        in_progress: applications.filter((a: any) => a.status === 'in_progress').length,
        accepted: applications.filter((a: any) => a.status === 'accepted').length,
        rejected: applications.filter((a: any) => a.status === 'rejected').length,
      }

      setStats({
        totalApplications: applications.length,
        applicationsByStatus,
        totalRecommendations: dashboardData.recommendations?.length || 0,
        totalDocuments: dashboardData.files?.length || 0,
        orientationsCount: orientations.length,
        favoriteSchools: favorites.length,
      })
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement de vos statistiques..." />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <ErrorMessage message={error} onClose={() => setError('')} />
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const totalStatus = Object.values(stats.applicationsByStatus).reduce((a, b) => a + b, 0)
  const acceptanceRate = totalStatus > 0 
    ? ((stats.applicationsByStatus.accepted / totalStatus) * 100).toFixed(1)
    : '0'

  return (
    <div className="max-w-7xl mx-auto animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Statistiques' },
        ]}
        className="mb-6"
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mes Statistiques</h1>
        <p className="mt-2 text-gray-600">Vue d&apos;ensemble de votre activité</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Candidatures</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recommandations</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRecommendations}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Documents</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Orientations</p>
              <p className="text-3xl font-bold text-gray-900">{stats.orientationsCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Status Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Répartition des Candidatures</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Intéressé</span>
              <span className="text-sm font-semibold text-gray-900">{stats.applicationsByStatus.interested}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${totalStatus > 0 ? (stats.applicationsByStatus.interested / totalStatus) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Candidature envoyée</span>
              <span className="text-sm font-semibold text-gray-900">{stats.applicationsByStatus.applied}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${totalStatus > 0 ? (stats.applicationsByStatus.applied / totalStatus) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">En cours de traitement</span>
              <span className="text-sm font-semibold text-gray-900">{stats.applicationsByStatus.in_progress}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${totalStatus > 0 ? (stats.applicationsByStatus.in_progress / totalStatus) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Accepté</span>
              <span className="text-sm font-semibold text-gray-900">{stats.applicationsByStatus.accepted}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${totalStatus > 0 ? (stats.applicationsByStatus.accepted / totalStatus) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Refusé</span>
              <span className="text-sm font-semibold text-gray-900">{stats.applicationsByStatus.rejected}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${totalStatus > 0 ? (stats.applicationsByStatus.rejected / totalStatus) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Taux d&apos;acceptation</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-green-600">{acceptanceRate}%</span>
            <span className="text-gray-600 mb-1">de candidatures acceptées</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Favoris</h3>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-blue-600">{stats.favoriteSchools}</span>
            <span className="text-gray-600 mb-1">écoles en favoris</span>
          </div>
        </div>
      </div>
    </div>
  )
}

