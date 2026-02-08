'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import EmptyState from '@/components/ui/EmptyState'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { DashboardGrid } from '@/components/dashboard/DashboardGrid'
import { StatCard } from '@/components/dashboard/StatCard'
import { Crown, User, Briefcase, FileText } from 'lucide-react'

interface DashboardData {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    isPremium: boolean
  }
  lastOrientation: any
  recommendations: Array<{
    id: string
    score: number
    school: {
      id: string
      name: string
      country: string
      city?: string
      imageUrl?: string
    }
  }>
  lastPayment: any
  files: Array<{
    id: string
    filename: string
    createdAt: string
  }>
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/dashboard/student`, {
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
    return <LoadingSpinner fullScreen text="Chargement de votre dashboard..." />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <ErrorMessage message={error} onClose={() => setError('')} />
      </div>
    )
  }

  if (!data) {
    return null
  }

  const isPremium = data.user.isPremium

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard' },
        ]}
        className="mb-8"
      />

      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-midnight-900 text-white p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-electric-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-400 to-purple-400">{data.user.firstName}</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl">
              Prêt à poursuivre votre chemin vers l'excellence ? Voici ce qui se passe aujourd'hui.
            </p>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${isPremium ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-slate-400'}`}></span>
              <span className="text-sm font-medium text-slate-900">{isPremium ? 'Membre Premium' : 'Compte Gratuit'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* Stats Cards */}
      <DashboardGrid className="md:grid-cols-3">
        <StatCard
          title="Statut"
          value={data.user.isPremium ? 'Premium' : 'Gratuit'}
          icon={data.user.isPremium ? <Crown className="h-4 w-4 text-yellow-500" /> : <User className="h-4 w-4" />}
          change={data.user.isPremium ? 'Actif' : 'Standard'}
          changeType={data.user.isPremium ? 'positive' : 'neutral'}
          className={data.user.isPremium ? 'border-yellow-200 bg-yellow-50/50' : ''}
        />
        <StatCard
          title="Recommandations"
          value={data.recommendations.length}
          icon={<Briefcase className="h-4 w-4 text-blue-500" />}
          change="Écoles compatibles"
          changeType="neutral"
        />
        <StatCard
          title="Documents"
          value={data.files.length}
          icon={<FileText className="h-4 w-4 text-purple-500" />}
          change="Fichiers sécurisés"
          changeType="neutral"
        />
      </DashboardGrid>

      {/* Quick Actions / Premium Upsell */}
      {!isPremium && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-electric-600 to-indigo-700 p-8 shadow-xl text-white">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold">Débloquez votre plein potentiel 🚀</h3>
              <p className="text-electric-100 max-w-lg">
                Accédez aux recommandations exclusives, aux statistiques détaillées et au support prioritaire.
              </p>
            </div>
            <Link
              href="/dashboard/student/paiement"
              className="px-8 py-3 bg-white text-electric-700 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-slate-50 hover:scale-105 transition-all text-sm whitespace-nowrap"
            >
              Devenir Premium
            </Link>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recommendations List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Top Recommandations</h2>
            <Link href="/dashboard/student/ecoles" className="text-sm font-medium text-electric-600 hover:text-electric-700 hover:underline">
              Voir tout
            </Link>
          </div>

          <div className="p-2 flex-1">
            {data.recommendations.length === 0 ? (
              <div className="h-48 flex items-center justify-center">
                <EmptyState
                  title="Aucune recommandation"
                  description="Complétez votre profil pour voir les écoles"
                  action={{
                    label: "Commencer",
                    onClick: () => window.location.href = "/dashboard/student/orientation/new"
                  }}
                />
              </div>
            ) : (
              <div className="space-y-2">
                {data.recommendations.slice(0, 3).map((rec, i) => (
                  <Link key={rec.id} href={`/dashboard/student/ecoles/${rec.school.id}`}>
                    <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 relative shrink-0">
                        {rec.school.imageUrl ? (
                          <img src={rec.school.imageUrl} alt={rec.school.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 font-bold text-xl">
                            {rec.school.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 group-hover:text-electric-600 transition-colors truncate">{rec.school.name}</h3>
                        <p className="text-sm text-slate-500">{rec.school.country}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="radial-progress text-xs font-bold text-electric-600">
                          <span className="bg-electric-50 px-2 py-1 rounded-md">{rec.score}% Match</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Last Orientation & Docs Preview */}
        <div className="space-y-8">
          {/* Orientation Card */}
          {data.lastOrientation && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-20 h-20 bg-electric-50 rounded-full blur-2xl relative -mr-10 -mt-10" />
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Dernière Orientation</h2>
                <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-electric-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{data.lastOrientation.level} • {data.lastOrientation.country}</p>
                    <p className="text-xs text-slate-500">Analysé le {new Date(data.lastOrientation.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <Link href={`/dashboard/student/orientation/${data.lastOrientation.id}`} className="ml-auto p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-electric-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips or Empty space */}
          <div className="bg-gradient-to-br from-slate-900 to-midnight-900 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 opacity-10">
              <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Conseil Pro</h3>
            <p className="text-slate-300 text-sm relative z-10 max-w-[80%]">
              Les profils complets à 100% reçoivent 2x plus de propositions des écoles. Prenez le temps de soigner votre dossier !
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
