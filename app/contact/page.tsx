'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// SVG Icons (replacing emojis)
const Icons = {
  mail: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  map: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  send: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  chat: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}

const contactInfo = [
  {
    icon: Icons.mail,
    title: 'Email',
    value: 'contact@accessuniversity.com',
    link: 'mailto:contact@accessuniversity.com',
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    icon: Icons.phone,
    title: 'Téléphone',
    value: '+33 1 23 45 67 89',
    link: 'tel:+33123456789',
    color: 'text-electric-600',
    bg: 'bg-electric-50'
  },
  {
    icon: Icons.map,
    title: 'Bureau',
    value: '123 Avenue de l\'Excellence, Paris',
    link: 'https://maps.google.com',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setSuccess(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSuccess(false), 5000)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* 1. Header Section */}
      <section className="bg-white pt-32 pb-20 px-6 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-50 text-electric-700 text-sm font-bold mb-8"
          >
            {Icons.chat}
            <span>Support 24/7</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight font-display"
          >
            Parlons de votre avenir
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Une question sur votre orientation ? Un problème technique ?
            Notre équipe est là pour vous accompagner.
          </motion.p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

          {/* LEFT: Contact Information */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Nos Coordonnées</h2>
              <p className="text-slate-500">
                Préférez-vous le contact direct ? Voici comment nous joindre rapidement.
              </p>

              <div className="space-y-4">
                {contactInfo.map((info, i) => (
                  <motion.a
                    key={i}
                    href={info.link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-lg hover:border-slate-200 transition-all group"
                  >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${info.bg} ${info.color} group-hover:scale-110 transition-transform`}>
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{info.title}</div>
                      <div className="text-slate-900 font-medium group-hover:text-electric-600 transition-colors">{info.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-electric-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="p-2 bg-white/10 rounded-lg">{Icons.clock}</span>
                  <h3 className="font-bold text-lg">Horaires d'ouverture</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span>Lun - Ven</span>
                    <span className="font-bold text-white">09:00 - 18:00</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-2">
                    <span>Samedi</span>
                    <span className="font-bold text-white">10:00 - 15:00</span>
                  </li>
                  <li className="flex justify-between opacity-50">
                    <span>Dimanche</span>
                    <span>Fermé</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Envoyez un message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Nom complet</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-electric-500 focus:ring-0 transition-colors outline-none font-medium placeholder:text-slate-400"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-electric-500 focus:ring-0 transition-colors outline-none font-medium placeholder:text-slate-400"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Sujet</label>
                  <select
                    name="subject"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-electric-500 focus:ring-0 transition-colors outline-none font-medium text-slate-600"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Sélectionnez un sujet</option>
                    <option value="orientation">Problème d'orientation</option>
                    <option value="technical">Support technique</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-electric-500 focus:ring-0 transition-colors outline-none font-medium placeholder:text-slate-400 resize-none"
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || success}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${success
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-electric-600 text-white hover:bg-electric-700 hover:shadow-lg hover:shadow-electric-600/30'
                      }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Envoi...
                      </>
                    ) : success ? (
                      <>
                        {Icons.check} Message envoyé !
                      </>
                    ) : (
                      <>
                        {Icons.send} Envoyer le message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  )
}
