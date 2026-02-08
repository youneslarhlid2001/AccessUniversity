'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import EmptyState from '@/components/ui/EmptyState'

interface School {
  id: string
  name: string
  description: string
  country: string
  city?: string
  price?: number
  ranking?: number
  badges?: string[]
  imageUrl?: string
}

// Custom Icons
const Icons = {
  search: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  filter: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  mapBase: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  star: <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  arrowRight: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
}

// Categories for horizontal scroll
const categories = ['Tout', 'Commerce', 'Ingénierie', 'Art & Design', 'Sciences Politiques', 'Santé', 'Architecture']

const fallbackSchools: School[] = [
  {
    id: '1',
    name: 'Imperial College London',
    description: 'Une institution de renommée mondiale pour la science et la médecine.',
    country: 'Royaume-Uni',
    city: 'Londres',
    price: 9200,
    ranking: 6,
    badges: ['Top 10', 'Recherche'],
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'HEC Paris',
    description: 'École de commerce leader en Europe, spécialisée en management.',
    country: 'France',
    city: 'Jouy-en-Josas',
    price: 15000,
    ranking: 1,
    badges: ['Elite', 'Business', 'Grandes Écoles'],
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'MIT',
    description: 'Institut de technologie du Massachusetts, leader mondial en ingénierie.',
    country: 'États-Unis',
    city: 'Cambridge',
    price: 45000,
    ranking: 1,
    badges: ['Top 1', 'Engineering'],
    imageUrl: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'ETH Zurich',
    description: 'École polytechnique fédérale de Zurich.',
    country: 'Suisse',
    city: 'Zurich',
    price: 1200,
    ranking: 9,
    badges: ['Top 10', 'Public'],
    imageUrl: 'https://images.unsplash.com/photo-1590740920427-440263f35a09?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'University of Toronto',
    description: 'Meilleure université du Canada, excellence en recherche.',
    country: 'Canada',
    city: 'Toronto',
    price: 25000,
    badges: ['Canada #1'],
    imageUrl: 'https://images.unsplash.com/photo-1626125345510-4603468eedfb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'Sciences Po Paris',
    description: 'Université de recherche internationale, sélective et ouverte sur le monde.',
    country: 'France',
    city: 'Paris',
    price: 10000,
    ranking: 3,
    badges: ['Sciences Po', 'Politique'],
    imageUrl: 'https://images.unsplash.com/photo-1497294815431-9365093b7331?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '7',
    name: 'Sorbonne Université',
    description: 'Université pluridisciplinaire de recherche intensive de rang mondial.',
    country: 'France',
    city: 'Paris',
    price: 170,
    ranking: 35,
    badges: ['Prestigieux', 'Public'],
    imageUrl: 'https://images.unsplash.com/photo-1592398501170-65231c5035f6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '8',
    name: 'École Polytechnique',
    description: "L'X, combine recherche, enseignement et innovation au plus haut niveau.",
    country: 'France',
    city: 'Palaiseau',
    price: 12000,
    ranking: 2,
    badges: ['Ingénieur', 'Militaire'],
    imageUrl: 'https://images.unsplash.com/photo-1549488497-6a56c07166a9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '9',
    name: 'Université Paris-Dauphine',
    description: 'Institution d\'enseignement supérieur spécialisée dans les sciences des organisations.',
    country: 'France',
    city: 'Paris',
    price: 550,
    ranking: 15,
    badges: ['Gestion', 'Sélectif'],
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '10',
    name: 'ESSEC Business School',
    description: 'Pionnière de l\'apprentissage, l\'ESSEC forme des managers agiles et créatifs.',
    country: 'France',
    city: 'Cergy',
    price: 16000,
    ranking: 4,
    badges: ['Business', 'Top 5'],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '11',
    name: 'INSEAD',
    description: "L'une des écoles de commerce les plus importantes et les plus influentes au monde.",
    country: 'France',
    city: 'Fontainebleau',
    price: 45000,
    ranking: 2,
    badges: ['MBA', 'International'],
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800'
  },
]

export default function SchoolsPage() {
  const [activeCategory, setActiveCategory] = useState('Tout')
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch mock or real data
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/schools`)
        if (!res.ok) throw new Error()
        let data: School[] = await res.json()

        // Enrich API data with images from matching fallback entries if missing
        if (data && data.length > 0) {
          data = data.map(school => {
            if (!school.imageUrl) {
              const fallback = fallbackSchools.find(f => f.name === school.name);
              return {
                ...school,
                imageUrl: fallback?.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800' // Default fallback
              };
            }
            return school;
          });
          setSchools(data)
        } else {
          setSchools(fallbackSchools)
        }
      } catch (error) {
        setSchools(fallbackSchools)
      } finally {
        setLoading(false)
      }
    }
    fetchSchools()
  }, [])

  const filteredSchools = useMemo(() => {
    return schools.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [schools, searchTerm])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* 1. Immersive Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        {/* Contextual Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
          {/* Gradient Overlay for Text Readability without being 'brut' */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              🎓 Découvrez l'excellence académique
            </span>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tight font-display leading-tight">
              Trouvez l'école qui <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-400 to-purple-400">changera votre vie.</span>
            </h1>

            {/* Giant Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl max-w-2xl mx-auto flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {Icons.search}
                </div>
                <input
                  type="text"
                  placeholder="Quelle école, ville ou domaine ?"
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-electric-500 font-medium text-slate-800 placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="h-14 px-8 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2">
                {Icons.search} Explorer
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Content Container */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 -mt-20 relative z-20">

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-8 hide-scrollbar mb-8">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${activeCategory === cat
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Schools Masonry Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-96 bg-slate-200 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredSchools.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredSchools.map((school) => (
              <motion.div
                key={school.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Link href={`/ecoles/${school.id}`} className="group block h-full">
                  <article className="relative h-full bg-white rounded-[32px] p-4 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-slate-100 flex flex-col">

                    {/* Image Card */}
                    <div className="relative aspect-[4/3] bg-slate-100 rounded-[24px] overflow-hidden mb-6">
                      {/* Overlay Gradient on Hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                      {school.imageUrl ? (
                        <Image
                          src={school.imageUrl}
                          alt={school.name}
                          fill
                          unoptimized={true}
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        /* Placeholder Image */
                        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-300">
                          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                        {school.badges?.map(badge => (
                          <span key={badge} className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold rounded-lg text-slate-900 shadow-sm">
                            {badge}
                          </span>
                        ))}
                      </div>

                      {/* Price Tag */}
                      {school.price && (
                        <div className="absolute bottom-4 right-4 z-20 px-4 py-2 bg-slate-900/90 backdrop-blur text-white text-sm font-bold rounded-xl shadow-lg">
                          {school.price.toLocaleString()}€ /an
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="px-2 pb-2 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-1 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                            {Icons.mapBase} {school.city}, {school.country}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-electric-600 transition-colors leading-tight">
                            {school.name}
                          </h3>
                        </div>
                        {school.ranking && (
                          <div className="flex flex-col items-center justify-center w-10 h-10 bg-amber-50 rounded-full text-amber-600 border border-amber-100">
                            <span className="text-[10px] font-bold">#</span>
                            <span className="text-sm font-bold leading-none">{school.ranking}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {school.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-electric-600 transition-colors">Découvrir le campus</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-electric-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-[-45deg]">
                          {Icons.arrowRight}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <EmptyState
              title="Aucune école trouvée"
              description="Essayez d'élargir vos critères de recherche."
            />
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-electric-600 font-bold hover:underline"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </section>

    </div>
  )
}
