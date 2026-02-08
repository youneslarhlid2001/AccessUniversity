'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'student' | 'school'>('student')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="w-full bg-[#F8FAFC] font-sans selection:bg-electric-500 selection:text-white">

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-[120px] opacity-60 animate-float" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-tr from-sky-100/40 to-blue-50/40 rounded-full blur-[100px] opacity-60 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 px-6 sm:px-8 lg:px-12 z-10">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Content */}
          <div className="space-y-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-white/60 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-electric-500"></span>
              </span>
              <span className="text-slate-600 font-medium text-sm tracking-wide">Le futur de l'orientation</span>
            </div>

            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight text-slate-900">
              Votre avenir <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-600 via-electric-500 to-indigo-600 animate-gradient-x">
                d'excellence.
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed font-light max-w-lg">
              La plateforme d'élite qui connecte les talents ambitieux aux établissements les plus prestigieux du monde.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link
                href="/orientation"
                className="group relative px-8 py-4 bg-electric-600 text-white rounded-2xl font-semibold text-lg hover:bg-electric-700 transition-all shadow-xl shadow-electric-500/20 hover:shadow-electric-500/40 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Je suis étudiant
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-electric-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                href="/partenaires"
                className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200/60 rounded-2xl font-semibold text-lg hover:bg-white hover:border-electric-200 transition-all shadow-lg shadow-slate-200/20 hover:shadow-xl hover:-translate-y-1"
              >
                Pour les écoles
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-slate-200/60">
              <div className="flex -space-x-4 hover:space-x-1 transition-all duration-300">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-[3px] border-white shadow-md relative overflow-hidden bg-slate-100 transition-transform hover:scale-110 hover:z-10 cursor-pointer group">
                    <div className={`w-full h-full bg-gradient-to-br ${i === 1 ? 'from-blue-200 to-indigo-300' :
                      i === 2 ? 'from-purple-200 to-pink-300' :
                        i === 3 ? 'from-teal-200 to-emerald-300' : 'from-orange-200 to-amber-300'
                      }`} />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-sm text-slate-500 font-medium">Rejoint par <span className="text-slate-900 font-bold">5,000+ talents</span></p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block perspective-[2000px] group">
            <div className="absolute inset-0 bg-gradient-to-tr from-electric-500/30 to-purple-500/30 rounded-[30px] blur-3xl transform -rotate-6 scale-95 opacity-60 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />

            <div className="relative transform transition-all duration-700 group-hover:rotate-y-[-5deg] group-hover:rotate-x-[5deg] preserve-3d">
              <div className="relative rounded-[30px] overflow-hidden shadow-2xl bg-white ring-1 ring-black/5">
                <div className="aspect-[4/3] relative bg-slate-100">
                  <Image
                    src="/images/hero-students.png"
                    alt="Étudiants AccessUniversity"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Floating Elements - Outside Overflow Container */}
              <div className="absolute -bottom-10 -left-10 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/50 animate-float z-20" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admission</p>
                    <p className="text-slate-900 font-bold text-lg">Harvard University</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 animate-float z-20" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />)}
                  </div>
                  <p className="text-sm font-semibold text-slate-700">+128 <span className="text-slate-500 font-normal">inscrits</span></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. LOGO STRIP - MARQUEE */}
      <section className="py-10 border-y border-slate-200/60 bg-white/40 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-[0.2em]">La confiance des leaders</p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="py-2 animate-marquee whitespace-nowrap flex items-center gap-16 lg:gap-24 opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700">
            {['HEC Paris', 'Polytechnique', 'Sciences Po', 'ESSEC', 'Sorbonne', 'Harvard', 'MIT', 'Stanford'].map((school, i) => (
              <span key={i} className="text-3xl font-serif font-bold text-slate-800">{school}</span>
            ))}
            {['HEC Paris', 'Polytechnique', 'Sciences Po', 'ESSEC', 'Sorbonne', 'Harvard', 'MIT', 'Stanford'].map((school, i) => (
              <span key={`dup-${i}`} className="text-3xl font-serif font-bold text-slate-800">{school}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DUAL VALUE PROPOSITION - INTERACTIVE TABS */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-block mb-4 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-widest uppercase">
              Pour tous les profils
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Une plateforme, <span className="text-electric-600">deux ambitions</span></h2>
            <p className="text-xl text-slate-500 leading-relaxed font-light">L'écosystème complet qui comble le fossé entre le potentiel et l'opportunité.</p>

            {/* Premium Toggle */}
            <div className="flex justify-center mt-12">
              <div className="bg-white p-1.5 rounded-full shadow-lg border border-slate-100 flex relative">
                <div
                  className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-electric-600 rounded-full transition-all duration-500 shadow-md ${activeTab === 'student' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
                />
                <button
                  onClick={() => setActiveTab('student')}
                  className={`relative px-8 py-3 rounded-full text-sm font-bold transition-colors duration-500 w-48 z-10 ${activeTab === 'student' ? 'text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Étudiants
                </button>
                <button
                  onClick={() => setActiveTab('school')}
                  className={`relative px-8 py-3 rounded-full text-sm font-bold transition-colors duration-500 w-48 z-10 ${activeTab === 'school' ? 'text-white' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Écoles
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 perspective-[1000px]">
            {/* Dynamic Content based on tab */}
            {(activeTab === 'student' ? [
              { title: 'Orientation IA', desc: 'Algorithme prédictif de matching.', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', color: 'bg-blue-50 text-blue-600' },
              { title: 'Candidature Unique', desc: 'Centralisez vos dossiers.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-purple-50 text-purple-600' },
              { title: 'Vie Campus', desc: 'Logement & Aides financières.', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'bg-emerald-50 text-emerald-600' }
            ] : [
              { title: 'Sourcing Intelligent', desc: 'Ciblage précis des candidats.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-amber-50 text-amber-600' },
              { title: 'Analytics', desc: 'Données en temps réel.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'bg-rose-50 text-rose-600' },
              { title: 'Marque Employeur', desc: 'Rayonnement international.', icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z', color: 'bg-cyan-50 text-cyan-600' }
            ]).map((item, i) => (
              <div key={i} className="group p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-electric-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DASHBOARD PREVIEW - DARK MODE SECTION */}
      <section className="py-32 bg-[#0B0F19] relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-electric-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">Le command center <br /><span className="text-electric-400">de votre succès.</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed font-light">
                Une interface conçue comme un cockpit. Tout ce dont vous avez besoin pour piloter votre avenir, centralisé dans un dashboard intuitif et puissant.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  { label: 'Suivi live', text: 'État des candidatures en temps réel' },
                  { label: 'Intelligent', text: 'Recommandations par IA' },
                  { label: 'Sécurisé', text: 'Coffre-fort numérique de documents' }
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-electric-500/20 flex items-center justify-center text-electric-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">{feat.label}</p>
                      <p className="text-slate-400 text-sm">{feat.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0B0F19] rounded-xl font-bold hover:bg-slate-200 transition-colors text-lg">
                  Commencer maintenant
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="relative bg-[#151B2B] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Mockup UI implementation with divs instead of image for crispness */}
                <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-[#1F2937]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="h-6 flex-1 bg-[#151B2B] rounded-md border border-white/5 opacity-50" />
                </div>
                <div className="p-8 aspect-[4/3] bg-[#0B0F19] flex gap-6">
                  <div className="w-1/4 space-y-3">
                    <div className="h-20 bg-[#1F2937] rounded-xl animate-pulse" />
                    <div className="h-8 bg-[#1F2937] rounded-lg opacity-50" />
                    <div className="h-8 bg-[#1F2937] rounded-lg opacity-50" />
                    <div className="h-8 bg-[#1F2937] rounded-lg opacity-50" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 h-32 bg-[#1F2937] rounded-xl border border-white/5" />
                      <div className="flex-1 h-32 bg-[#1F2937] rounded-xl border border-white/5" />
                    </div>
                    <div className="h-48 bg-[#1F2937] rounded-xl border border-white/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 tracking-tighter">Votre futur n'attend pas.</h2>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">Rejoignez la communauté des étudiants qui transforment leur ambition en admission.</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-10 py-5 bg-electric-600 text-white text-xl font-bold rounded-2xl shadow-xl shadow-electric-500/30 hover:bg-electric-700 hover:scale-105 transition-all duration-300">
              Créer un compte
            </Link>
            <Link href="/contact" className="px-10 py-5 bg-slate-100 text-slate-600 text-xl font-bold rounded-2xl hover:bg-slate-200 hover:text-slate-900 transition-all duration-300">
              Nous contacter
            </Link>
          </div>
        </div>

        {/* Decorative letters */}
        <div className="absolute left-0 bottom-0 text-[20vw] leading-none font-bold text-slate-50 opacity-50 select-none pointer-events-none -mb-10 -ml-10">AU</div>
      </section>

    </div>
  )
}
