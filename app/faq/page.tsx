'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

const categories = [
  {
    id: 'Tous',
    label: 'Tout voir',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
  },
  {
    id: 'Orientation',
    label: 'Orientation & Ecoles',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  },
  {
    id: 'Premium',
    label: 'Offre Premium',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
  },
  {
    id: 'Documents',
    label: 'Documents',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
  },
  {
    id: 'Logement',
    label: 'Logement',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  },
  {
    id: 'Support',
    label: 'Support',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  },
]

// Fallback data if API fails
const fallbackFaqs: FAQ[] = [
  {
    id: '1',
    category: 'Orientation',
    question: "Comment fonctionne l'algorithme d'orientation ?",
    answer: "Notre algorithme analyse 15 points de données de votre profil (notes, budget, préférences géographiques, carrière visée) pour le comparer à notre base de 500+ écoles partenaires et identifier les meilleures correspondances.",
    order: 1
  },
  {
    id: '2',
    category: 'Premium',
    question: "Quels sont les avantages du compte Premium ?",
    answer: "Le compte Premium (600€) débloque un accompagnant dédié, la revue illimitée de vos lettres de motivation, des simulations d'entretien, et une garantie de réponse des écoles sous 72h.",
    order: 2
  },
]


// Nouvelles ressources pour le bloc additionnel
const resources = [
  {
    title: "Guide de l'étudiant",
    desc: "Tout savoir sur les démarches de visa, logement et vie quotidienne.",
    icon: <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    href: '#'
  },
  {
    title: "Webinaires",
    desc: "Replays de nos sessions d'information avec les écoles partenaires.",
    icon: <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    href: '#'
  },
  {
    title: "Blog & Actualités",
    desc: "Conseils et astuces pour réussir votre admission.",
    icon: <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
    href: '#'
  }
]

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/faqs`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setFaqs(data.length > 0 ? data : fallbackFaqs)
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      setFaqs(fallbackFaqs)
    } finally {
      setLoading(false)
    }
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'Tous' || faq.category === selectedCategory
    const matchesSearch = !searchTerm ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const getIcon = (category: string) => {
    // Helper to match category to icon or default
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Search Header - Large & Clean */}
      <section className="bg-white pt-32 pb-20 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight"
          >
            Comment pouvons-nous vous aider ?
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une réponse (ex: prix, visa, logement...)"
              className="w-full px-6 py-5 pl-14 text-lg bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-electric-500 focus:ring-4 focus:ring-electric-500/10 transition-all outline-none placeholder:text-slate-400"
            />
            <svg className="w-6 h-6 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Horizontal Categories Scroll */}
        <div className="flex overflow-x-auto pb-8 -mx-6 px-6 gap-4 no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setExpandedId(null); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-medium ${selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
            >
              <span className={selectedCategory === cat.id ? 'text-electric-400' : 'text-slate-400'}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-12 gap-12"
        >
          {/* FAQ List */}
          <div className="md:col-span-8 space-y-4">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedCategory === 'Tous' ? 'Toutes les questions' : selectedCategory}
              </h2>
              <span className="text-sm text-slate-400">{filteredFaqs.length} articles</span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>)}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {filteredFaqs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                      <motion.div
                        key={faq.id}
                        variants={itemVariants}
                        layout
                        className={`bg-white rounded-2xl transition-all duration-300 overflow-hidden ${expandedId === faq.id
                          ? 'shadow-xl shadow-electric-500/5 ring-1 ring-electric-500'
                          : 'border border-slate-100 hover:border-slate-300'
                          }`}
                      >
                        <button
                          onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                          className="w-full text-left p-6 flex items-start gap-4"
                        >
                          <div className={`mt-0.5 p-2 rounded-lg transition-colors duration-300 flex-shrink-0 ${expandedId === faq.id ? 'bg-electric-50 text-electric-600' : 'bg-slate-50 text-slate-400'
                            }`}>
                            {getIcon(faq.category)}
                          </div>
                          <div className="flex-1 pr-4">
                            <h3 className={`text-lg font-bold transition-colors ${expandedId === faq.id ? 'text-electric-600' : 'text-slate-800'
                              }`}>
                              {faq.question}
                            </h3>
                          </div>
                          <div className={`transition-transform duration-300 flex-shrink-0 text-slate-400 ${expandedId === faq.id ? 'rotate-180 text-electric-500' : ''
                            }`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>

                        <motion.div
                          initial={false}
                          animate={{ height: expandedId === faq.id ? 'auto' : 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0 pl-[4.5rem]">
                            <p className="text-slate-600 leading-relaxed">
                              {faq.answer}
                            </p>
                            {faq.category === 'Premium' && (
                              <Link href="/paiement" className="inline-block mt-4 text-sm font-bold text-electric-600 hover:underline">
                                Voir les offres Premium →
                              </Link>
                            )}
                            {faq.category === 'Orientation' && (
                              <Link href="/orientation" className="inline-block mt-4 text-sm font-bold text-electric-600 hover:underline">
                                Commencer mon orientation →
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200"
                  >
                    <p className="text-slate-500">Aucun résultat pour cette recherche.</p>
                    <button
                      onClick={() => { setSearchTerm(''); setSelectedCategory('Tous') }}
                      className="text-electric-600 font-bold mt-2 hover:underline"
                    >
                      Réinitialiser
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Right Sidebar - Support & Actions */}
          <div className="md:col-span-4 space-y-6">

            {/* Contact Card */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-electric-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Besoin d&apos;aide directe ?</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Nos experts sont disponibles pour répondre à vos questions spécifiques.
                </p>
                <Link
                  href="/contact"
                  className="block w-full text-center bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-electric-50 transition-colors"
                >
                  Contacter le support
                </Link>
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="font-medium text-slate-300">Live support</span>
                  </span>
                  <span>•</span>
                  <span>~2h réponse</span>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Raccourcis</h3>
              <nav className="space-y-2">
                <Link href="/orientation" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group transition-colors">
                  <span className="text-slate-600 group-hover:text-slate-900 font-medium">Lancer l&apos;orientation</span>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-electric-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link href="/ecoles" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group transition-colors">
                  <span className="text-slate-600 group-hover:text-slate-900 font-medium">Parcourir les écoles</span>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-electric-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link href="/register" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 group transition-colors">
                  <span className="text-slate-600 group-hover:text-slate-900 font-medium">Créer un compte</span>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-electric-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </nav>
            </div>

          </div>
        </motion.div>

        {/* New Resources Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Ressources Utiles</h2>
            <p className="text-slate-500">Pour aller plus loin dans vos démarches</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((res, i) => (
              <a key={i} href={res.href} className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                  {res.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-electric-600 transition-colors">{res.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{res.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Global CTA */}
        <div className="mt-20 bg-electric-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mb-20"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Toujours pas de réponse ?</h2>
            <p className="text-electric-100 mb-8 text-lg">
              Envoyez-nous un message détaillé. Nous vous répondrons personnellement dans les plus brefs délais.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-electric-600 px-8 py-4 rounded-xl font-bold hover:bg-electric-50 transition-colors shadow-lg shadow-black/10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Envoyer un message
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
