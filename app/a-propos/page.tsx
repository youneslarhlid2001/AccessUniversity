'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface TeamMember {
  id: string
  name: string
  role: string
  imageUrl?: string
  bio?: string
  linkedin?: string
}

// Data
const stats = [
  {
    value: '2500+',
    label: 'Étudiants accompagnés',
    icon: (
      <svg className="w-8 h-8 text-electric-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    )
  },
  {
    value: '50+',
    label: 'Pays partenaires',
    icon: (
      <svg className="w-8 h-8 text-electric-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    value: '98%',
    label: 'Taux de réussite',
    icon: (
      <svg className="w-8 h-8 text-electric-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    value: '150+',
    label: 'Universités partenaires',
    icon: (
      <svg className="w-8 h-8 text-electric-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
]

const values = [
  {
    title: 'Excellence',
    description: "Nous visons l'excellence académique pour chacun de nos étudiants.",
    icon: (
      <svg className="w-8 h-8 text-electric-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
  {
    title: 'Innovation',
    description: "Une approche moderne et digitale de l'orientation internationale.",
    icon: (
      <svg className="w-8 h-8 text-electric-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Transparence',
    description: "Des conseils honnêtes et des processus clairs, sans frais cachés.",
    icon: (
      <svg className="w-8 h-8 text-electric-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Accompagnement',
    description: "Un suivi personnalisé du début de la réflexion jusqu'à l'installation.",
    icon: (
      <svg className="w-8 h-8 text-electric-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
]

const storySteps = [
  { year: '2020', title: 'La Genèse', desc: 'Lancement du projet par un collectif d\'anciens étudiants internationaux.' },
  { year: '2022', title: '500+ Étudiants', desc: 'Une première étape symbolique franchie et des retours exceptionnels.' },
  { year: '2024', title: 'Plateforme 2.0', desc: 'Digitalisation complète du processus avec notre nouvel outil d\'IA.' },
]

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    // Fetch team data
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/team`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setTeam(data)
      } catch (e) {
        // Fallback data if API fails
        setTeam([
          { id: '1', name: 'Sophie Martin', role: 'CEO & Co-Founder', bio: 'Ancienne étudiante à LSE.' },
          { id: '2', name: 'Thomas Dubreuil', role: 'CTO', bio: 'Expert EdTech.' },
          { id: '3', name: 'Amine El Idrissi', role: 'Head of Partnerships', bio: 'Network specialist.' },
        ])
      }
    }
    fetchTeam()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">

      {/* 1. Modern Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-electric-100 rounded-full blur-[120px] pointer-events-none opacity-60"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-purple-100 rounded-full blur-[100px] pointer-events-none opacity-60"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-electric-600 text-sm font-semibold mb-8 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span>L'avenir de l'orientation internationale</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight font-display"
          >
            Nous construisons les <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-600 to-purple-600">
              leaders de demain
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            AccèsUniversity n'est pas seulement une plateforme d'admission. C'est un tremplin vers les meilleures opportunités mondiales, conçu pour simplifier chaque étape de votre voyage vers l'excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/ecoles" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
              Découvrir nos partenaires
            </Link>
            <Link href="/contact" className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all border border-slate-200">
              Rencontrer l'équipe
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats Banner - Floating Card */}
      <section className="px-6 -mt-20 relative z-20 mb-32">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-12 border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <span className="p-3 bg-electric-50 rounded-xl text-electric-600">
                    {stat.icon}
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-slate-500 font-medium text-sm p-0 m-0 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Our Values Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nos Valeurs Fondamentales</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Ce qui guide nos actions au quotidien pour votre réussite.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="group p-8 rounded-2xl bg-slate-50 hover:bg-electric-50/50 transition-colors border border-transparent hover:border-electric-100">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Story Timeline - Innovative Layout */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Une histoire d'ambition et de partage</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Tout a commencé par une frustration : la complexité des démarches administratives pour étudier à l'étranger. Aujourd'hui, nous avons transformé cette complexité en une expérience fluide et inspirante.
              </p>
              <Link href="/contact" className="text-electric-400 font-bold hover:text-white transition-colors flex items-center gap-2">
                Rejoindre l'aventure
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            <div className="space-y-8">
              {storySteps.map((step, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="text-electric-500 font-mono text-xl font-bold pt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    {step.year}
                  </div>
                  <div className="flex-1 pb-8 border-b border-white/10 group-last:border-0">
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:translate-x-2 transition-transform">{step.title}</h3>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Team Section - Dynamic from API */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-16">L'équipe dirigeante</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.length > 0 ? (
              team.map((member) => (
                <div key={member.id} className="group">
                  <div className="aspect-[4/5] bg-slate-200 rounded-2xl mb-6 overflow-hidden relative">
                    {member.imageUrl ? (
                      <Image src={member.imageUrl} alt={member.name} fill className="object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-200 group-hover:bg-slate-300 transition-colors">
                        <svg className="w-16 h-16 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                  <p className="text-electric-600 font-medium text-sm mb-2">{member.role}</p>
                  {member.bio && <p className="text-slate-500 text-xs mt-2 px-4">{member.bio}</p>}
                </div>
              ))
            ) : (
              <div className="col-span-3 text-slate-400 flex justify-center py-10">
                <div className="animate-pulse">Chargement de l'équipe...</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. CTA Finale */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 font-display">
            Prêt à écrire votre propre histoire ?
          </h2>
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Ne laissez pas les frontières limiter votre potentiel. Le monde vous attend.
          </p>
          <Link
            href="/orientation"
            className="inline-block bg-electric-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-xl hover:shadow-electric-600/30 transition-all duration-300"
          >
            Commencer mon inscription
          </Link>
        </div>
      </section>

    </div>
  )
}
