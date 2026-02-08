'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Briefcase, MapPin, Target, User, Award, School } from 'lucide-react'

interface OrientationDetail {
    id: string
    level: string
    country: string
    objectives: string
    profile: string
    score: number
    createdAt: string
    recommendations: Array<{
        id: string
        score: number
        school: {
            id: string
            name: string
            country: string
            imageUrl?: string
            price?: number
            description: string
        }
    }>
}

export default function OrientationDetailPage() {
    const params = useParams()
    const [orientation, setOrientation] = useState<OrientationDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (params.id) {
            fetchOrientationDetails(params.id as string)
        }
    }, [params.id])

    const fetchOrientationDetails = async (id: string) => {
        try {
            setError('')
            const token = localStorage.getItem('token')

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orientation/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                throw new Error('Orientation non trouvée')
            }

            const data = await res.json()
            setOrientation(data)
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des détails')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <LoadingSpinner fullScreen text="Chargement de l'analyse..." />
    }

    if (error || !orientation) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <ErrorMessage message={error} onClose={() => window.history.back()} />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto animate-page-enter pb-16">
            <Breadcrumbs
                items={[
                    { label: 'Dashboard', href: '/dashboard/student' },
                    { label: 'Historique', href: '/dashboard/student/orientation' },
                    { label: 'Détails de l\'analyse' },
                ]}
                className="mb-8"
            />

            {/* Header / Hero Section */}
            <div className="relative rounded-3xl bg-slate-900 text-white p-8 md:p-12 overflow-hidden shadow-2xl mb-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8 md:items-end">
                    <div>
                        <div className="flex items-center gap-2 text-electric-300 font-semibold mb-3 tracking-wide text-sm uppercase">
                            <Award className="w-5 h-5" />
                            Analyse Complète
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                            Résultats d'Orientation
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
                            Nous avons analysé votre profil pour trouver les meilleures correspondances.
                            Voici les opportunités qui s'ouvrent à vous en {orientation.country}.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-right">
                            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-400 to-white">
                                {orientation.score}%
                            </div>
                            <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">Potentiel de réussite</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Side: Context & Criteria */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-50">
                            <Target className="w-5 h-5 text-electric-600" />
                            Critères d'analyse
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-electric-50 flex items-center justify-center text-xl shrink-0">🎓</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Niveau Actuel</h4>
                                    <p className="text-slate-600 capitalize">{orientation.level}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl shrink-0">🌍</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Destination</h4>
                                    <p className="text-slate-600">{orientation.country}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl shrink-0">♟️</div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Profil & Objectifs</h4>
                                    <p className="text-slate-600 text-sm line-clamp-3 italic">
                                        "{orientation.objectives}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50">
                            <Link href="/dashboard/student/orientation/new" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors">
                                <span className="text-lg">↺</span> Relancer une analyse
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Side: Recommendations */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <School className="w-6 h-6 text-electric-600" />
                            Écoles Recommandées
                            <span className="bg-electric-100 text-electric-700 text-xs px-2.5 py-0.5 rounded-full font-bold align-middle translate-y-[-1px]">
                                {orientation.recommendations?.length || 0}
                            </span>
                        </h2>
                    </div>

                    {orientation.recommendations && orientation.recommendations.length > 0 ? (
                        <div className="grid gap-6">
                            {orientation.recommendations.map((rec) => (
                                <Link
                                    key={rec.id}
                                    href={`/dashboard/student/ecoles/${rec.school.id}`}
                                    className="group bg-white rounded-2xl border border-slate-200 p-1 hover:shadow-xl hover:shadow-electric-900/5 hover:border-electric-200 transition-all duration-300"
                                >
                                    <div className="flex flex-col sm:flex-row gap-6 p-5">
                                        {/* Image */}
                                        <div className="w-full sm:w-48 h-32 sm:h-auto rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
                                            {rec.school.imageUrl ? (
                                                <img
                                                    src={rec.school.imageUrl}
                                                    alt={rec.school.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300 font-bold bg-slate-50">
                                                    {rec.school.name[0]}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-electric-600 transition-colors">
                                                        {rec.school.name}
                                                    </h3>
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg whitespace-nowrap">
                                                        {rec.score}% Match
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mt-1 mb-3">
                                                    <MapPin className="w-4 h-4" />
                                                    {rec.school.country}
                                                </div>
                                                <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                                                    {rec.school.description || "Découvrez une formation d'excellence adaptée à votre profil."}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                                <div className="text-sm font-bold text-slate-900">
                                                    {rec.school.price ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(rec.school.price) : 'Prix sur demande'}
                                                    <span className="text-slate-400 font-normal"> / an</span>
                                                </div>
                                                <span className="text-electric-600 text-sm font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                    Voir le détail <span className="text-lg leading-none">→</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-4">🔮</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun résultat exact</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-6">
                                Il semble qu'aucune école ne corresponde parfaitement à ces critères spécifiques.
                            </p>
                            <Link href="/dashboard/student/orientation/new" className="px-6 py-2.5 bg-electric-600 text-white rounded-xl font-bold hover:bg-electric-700 transition-colors shadow-lg shadow-electric-600/20">
                                Relancer une recherche
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
