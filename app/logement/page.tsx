'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import EmptyState from '@/components/ui/EmptyState'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Pagination from '@/components/ui/Pagination'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface HousingPartner {
  id: string
  name: string
  email: string
  website: string
  cities: string[]
  description?: string
  imageUrl?: string // Added just in case backend supports it later or we use placeholders
}

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Vérifiés',
    description: 'Partenaires de confiance uniquement.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Rapide',
    description: 'Logements disponibles immédiatement.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Global',
    description: 'Présence dans +50 villes.'
  }
]

// Fallback Data if API fails
const fallbackPartners: HousingPartner[] = [
  {
    id: '1',
    name: 'Studapart',
    email: 'contact@studapart.com',
    website: 'https://studapart.com',
    cities: ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille'],
    description: 'La solution numéro 1 pour réserver son logement étudiant en ligne.',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Spotahome',
    email: 'hello@spotahome.com',
    website: 'https://spotahome.com',
    cities: ['Paris', 'Lyon', 'Madrid', 'Barcelone', 'Londres', 'Berlin'],
    description: 'Visitez des centaines de logements sans bouger de chez vous.',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Nexity Studea',
    email: 'contact@nexity-studea.com',
    website: 'https://nexity-studea.com',
    cities: ['Paris', 'Lille', 'Toulouse', 'Nantes', 'Montpellier'],
    description: 'Leader de la résidence étudiante en France avec services inclus.',
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Adele',
    email: 'contact@adele.org',
    website: 'https://www.adele.org',
    cities: ['Toues les villes de France'],
    description: 'Le site des logements étudiants. Trouvez votre résidence étudiante partout en France.',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'ImmoJeune',
    email: 'support@immojeune.com',
    website: 'https://www.immojeune.com',
    cities: ['Paris', 'Bordeaux', 'Lyon', 'Toulouse'],
    description: 'Portail du logement étudiant : location, colocation et résidence étudiante.',
    imageUrl: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'LivinFrance',
    email: 'hello@livin-france.com',
    website: 'https://livin-france.com',
    cities: ['Paris', 'Lille', 'Valenciennes', 'Lyon'],
    description: 'Plateforme tout-en-un pour les étudiants internationaux en France.',
    imageUrl: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '7',
    name: 'Cardinal Campus',
    email: 'contact@cardinalcampus.fr',
    website: 'https://www.cardinalcampus.fr',
    cities: ['Lyon', 'Paris', 'Bordeaux', 'Montpellier'],
    description: 'Gestionnaire de résidences étudiantes, des lieux de vie conviviaux et sécurisés.',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
  },
]


export default function HousingPage() {
  const [partners, setPartners] = useState<HousingPartner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setError('')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/housing-partners`, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`)
      }

      let data: HousingPartner[] = await res.json()

      if (Array.isArray(data)) {
        // Enrich data with fallback images if missing
        if (data.length > 0) {
          data = data.map(partner => {
            if (!partner.imageUrl) {
              const fallback = fallbackPartners.find(f => f.name === partner.name);
              return {
                ...partner,
                imageUrl: fallback?.imageUrl || '/images/studapart.png' // Default fallback
              };
            }
            return partner;
          });
        }
        setPartners(data.length > 0 ? data : fallbackPartners)
      } else {
        setPartners(fallbackPartners)
        console.warn('Invalid data format, using fallback')
      }
    } catch (err: any) {
      console.warn('API Error, using fallback data:', err)
      setPartners(fallbackPartners)
    } finally {
      setLoading(false)
    }
  }

  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        partner.name?.toLowerCase().includes(searchLower) ||
        partner.description?.toLowerCase().includes(searchLower) ||
        partner.cities?.some(city => city.toLowerCase().includes(searchLower))
      const matchesCity = !selectedCity || partner.cities?.includes(selectedCity)
      return matchesSearch && matchesCity
    })
  }, [partners, searchTerm, selectedCity])

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage)
  const paginatedPartners = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredPartners.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredPartners, currentPage, itemsPerPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCity])

  const allCities = useMemo(() =>
    Array.from(new Set(partners.flatMap((p) => p.cities || []))).sort(),
    [partners]
  )

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCity('')
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Premium Hero */}
      <div className="relative overflow-hidden pt-32 pb-48">
        {/* Contextual Background Image */}
        <div className="absolute inset-0 z-0">
          {/* Cozy Apartment Image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522771753035-4848230d6760?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
          {/* Overlays for depth and readability */}
          <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/90 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Réseau certifié AccessUniversity
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Trouvez votre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-400 to-purple-400">Logement Idéal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light"
          >
            Plus de souci pour votre installation. Accédez à des milliers de logements étudiants vérifiés dans le monde entier.
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 md:gap-8"
          >
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-electric-400">{b.icon}</div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">{b.title}</div>
                  <div className="text-slate-400 text-xs">{b.description}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Content with Overlap */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 -mt-24 pb-20">

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-3xl shadow-xl mb-12"
        >
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Recherche</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-electric-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Résidence, agence, mot-clé..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-electric-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Destination</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 group-focus-within:text-electric-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-electric-500 focus:border-transparent transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Toutes les villes</option>
                  {allCities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCity) && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center animate-fade-in">
              <span className="text-sm text-slate-500">
                <strong>{filteredPartners.length}</strong> résultats
              </span>
              <button
                onClick={clearFilters}
                className="mt-4 text-electric-600 font-bold hover:underline"
              >
                Voir tous les partenaires
              </button>
            </div>
          )}
        </motion.div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-96 bg-white rounded-3xl animate-pulse shadow-sm"></div>
            ))}
          </div>
        ) : filteredPartners.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {paginatedPartners.map((partner) => (
              <motion.div variants={item} key={partner.id} className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-electric-500/10 hover:-translate-y-1 transition-all duration-300">

                {/* Card Header Pattern */}
                <div className="h-32 bg-slate-900 relative overflow-hidden">
                  {/* Partner Image Background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${partner.imageUrl})` }}
                  ></div>
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 z-10">
                    <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Vérifié
                  </div>
                </div>

                {/* Logo/Icon Overlay */}
                <div className="absolute top-20 left-8">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-electric-600 border border-slate-100">
                    <span className="text-2xl font-bold">{partner.name.charAt(0)}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="pt-12 px-8 pb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-electric-600 transition-colors">{partner.name}</h3>

                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                    {partner.description || "Partenaire logement de confiance pour les étudiants internationaux."}
                  </p>

                  {/* Meta Data */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {partner.cities.slice(0, 3).map(city => (
                      <span key={city} className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold border border-slate-100">
                        {city}
                      </span>
                    ))}
                    {partner.cities.length > 3 && (
                      <span className="bg-slate-50 text-slate-400 px-2 py-1 rounded-md text-xs font-medium border border-slate-100">
                        +{partner.cities.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener"
                      className="flex-1 text-center bg-slate-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-electric-600 transition-colors shadow-lg shadow-slate-900/10"
                    >
                      Voir les offres
                    </a>
                    <a
                      href={`mailto:${partner.email}`}
                      title="Envoyer un email"
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-electric-600 hover:border-electric-200 bg-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <EmptyState
              title="Aucun résultat"
              description="Nous n'avons trouvé aucun partenaire correspondant à vos critères."
            />
            <button
              onClick={clearFilters}
              className="mt-4 text-electric-600 font-bold hover:underline"
            >
              Voir tous les partenaires
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredPartners.length > 0 && totalPages > 1 && (
          <div className="mt-16">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredPartners.length}
            />
          </div>
        )}

      </div>

    </div >
  )
}
