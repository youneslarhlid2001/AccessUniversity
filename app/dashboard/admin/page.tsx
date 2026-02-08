'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { DashboardGrid } from '@/components/dashboard/DashboardGrid'
import { StatCard } from '@/components/dashboard/StatCard'
import { Crown, Users, Building, Euro } from 'lucide-react'

interface AdminDashboardData {
  stats: {
    totalStudents: number
    premiumStudents: number
    totalSchools: number
    totalRevenue: number
  }
  students: Array<{
    id: string
    email: string
    firstName: string
    lastName: string
    isPremium: boolean
    createdAt: string
  }>
  schools: Array<{
    id: string
    name: string
    country: string
  }>
  recentPayments: Array<{
    id: string
    amount: number
    createdAt: string
    user: {
      firstName: string
      lastName: string
    }
  }>
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/dashboard/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Erreur lors du chargement des données')
      }

      const dashboardData = await res.json()
      setData(dashboardData)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement du dashboard admin..." />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <ErrorMessage message={error} onClose={() => setError('')} />
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard Admin' },
        ]}
        className="mb-6"
      />
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
        <p className="mt-2 text-gray-600">Vue d&apos;ensemble de la plateforme</p>
      </div>

      {/* Stats Cards */}
      {/* Stats Cards */}
      <DashboardGrid>
        <StatCard
          title="Total Étudiants"
          value={data.stats.totalStudents}
          icon={<Users className="h-4 w-4 text-blue-600" />}
          change="+12% cette semaine"
          changeType="positive"
        />
        <StatCard
          title="Étudiants Premium"
          value={data.stats.premiumStudents}
          icon={<Crown className="h-4 w-4 text-amber-600" />}
          change={`${Math.round((data.stats.premiumStudents / data.stats.totalStudents) * 100)}% du total`}
          changeType="neutral"
        />
        <StatCard
          title="Total Écoles"
          value={data.stats.totalSchools}
          icon={<Building className="h-4 w-4 text-green-600" />}
          change="+2 nouveaux"
          changeType="positive"
        />
        <StatCard
          title="Revenus Total"
          value={new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(data.stats.totalRevenue)}
          icon={<Euro className="h-4 w-4 text-yellow-600" />}
          change="+8.2% vs M-1"
          changeType="positive"
        />
      </DashboardGrid>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Paiements Récents</h2>
        </div>
        <div className="p-6">
          {data.recentPayments.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Aucun paiement récent</p>
          ) : (
            <div className="space-y-4">
              {data.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {payment.user.firstName} {payment.user.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payment.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

