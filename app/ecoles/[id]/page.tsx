'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

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

export default function SchoolDetailPage() {
  const params = useParams()
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchSchool(params.id as string)
    }
  }, [params.id])

  const fetchSchool = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/schools/${id}`)
      if (!res.ok) {
        throw new Error('École non trouvée')
      }
      const data = await res.json()
      setSchool(data)
    } catch (error) {
      console.error('Error fetching school:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block rounded-full h-16 w-16 border-4 border-electric-200 border-t-electric-600 animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium animate-pulse">Chargement des informations...</p>
        </div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="text-center bg-white rounded-3xl shadow-xl border border-slate-100 p-12 max-w-md mx-6">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">École non trouvée</h3>
          <p className="text-slate-500 mb-8">L&apos;établissement que vous recherchez n&apos;existe pas ou a été supprimé.</p>
          <Link
            href="/ecoles"
            className="inline-block bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-electric-600 transition-all shadow-lg shadow-slate-900/10"
          >
            Retour aux écoles
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Immersive Audio-Visual Hero */}
      <div className="relative h-[60vh] min-h-[500px] bg-slate-900 overflow-hidden">
        {school.imageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={school.imageUrl}
              alt={school.name}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-midnight-900 to-slate-800">
            <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>
          </div>
        )}

        {/* Back Navigation */}
        <div className="absolute top-28 left-6 md:left-12 z-20">
          <Link
            href="/ecoles"
            className="group flex items-center gap-2 text-white/80 hover:text-white bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/20 transition-all"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Retour</span>
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex gap-3 mb-6 flex-wrap">
                <span className="bg-electric-500/20 backdrop-blur-md border border-electric-500/30 text-electric-300 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Certifié Excellence
                </span>
                {school.city && (
                  <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    📍 {school.city}, {school.country}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-xl font-display">
                {school.name}
              </h1>

              {school.price && (
                <div className="flex items-center gap-2 text-2xl text-white/90 font-light">
                  <span className="text-electric-400 font-bold">{school.price.toLocaleString()}€</span>
                  <span className="text-base text-white/50">/ an</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-16 -mt-12 relative z-30">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left Column (Details) */}
          <div className="lg:col-span-8 space-y-8 animate-fade-in-up delay-200">

            {/* About Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-electric-50 rounded-xl flex items-center justify-center text-electric-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">À propos</h2>
                  <p className="text-slate-500 text-sm">Description de l&apos;établissement</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">{school.description}</p>
            </div>

            {/* Programs Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-electric-50 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Programmes Académiques</h2>
                  <p className="text-slate-500 text-sm">Formations et cursus disponibles</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:text-slate-800">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="whitespace-pre-line leading-relaxed">{school.program}</p>
                </div>
              </div>
            </div>

            {/* Stats / Features Grid */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">94%</div>
                <div className="text-sm text-slate-500">Taux d&apos;insertion</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">1:12</div>
                <div className="text-sm text-slate-500">Prof / Élèves</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                <div className="text-3xl font-bold text-slate-900 mb-1">TOP 50</div>
                <div className="text-sm text-slate-500">Classement</div>
              </div>
            </div>

          </div>

          {/* Right Column (Sticky Sidebar) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Main CTA Card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden sticky top-28">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-electric-600/20 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

              <h3 className="text-2xl font-bold mb-4 relative z-10">Intéressé ?</h3>
              <p className="text-slate-300 mb-8 relative z-10 leading-relaxed">
                Ne manquez pas votre chance. Commencez votre dossier d'admission dès maintenant pour la prochaine rentrée.
              </p>

              <div className="space-y-3 relative z-10">
                <Link
                  href="/orientation"
                  className="block w-full bg-white text-slate-900 text-center py-4 rounded-xl font-bold hover:bg-electric-50 transition-colors"
                >
                  Postuler maintenant
                </Link>
                <Link
                  href="/contact"
                  className="block w-full bg-white/10 backdrop-blur border border-white/10 text-white text-center py-4 rounded-xl font-bold hover:bg-white/20 transition-colors"
                >
                  Poser une question
                </Link>
              </div>

              {school.website && (
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener"
                    className="text-electric-400 text-sm font-medium hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2-2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Site officiel de l&apos;école
                  </a>
                </div>
              )}
            </div>

            {/* Quick Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Détails pratiques</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Localisation</div>
                    <div className="text-slate-700 font-medium">{school.city ? `${school.city}, ${school.country}` : school.country}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Frais de scolarité</div>
                    <div className="text-slate-700 font-medium">{school.price ? `${school.price.toLocaleString()}€ / an` : 'Non communiqué'}</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Prochaine Rentrée</div>
                    <div className="text-slate-700 font-medium">Septembre 2024</div>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
