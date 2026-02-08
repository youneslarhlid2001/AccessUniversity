'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Detect scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/ecoles', label: 'Écoles' },
    { href: '/logement', label: 'Logement' },
    { href: '/orientation', label: 'Orientation' },
  ]

  const secondaryLinks = [
    { href: '/a-propos', label: 'À Propos' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo.png"
                alt="AccessUniversity Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className={`font-display font-bold text-lg tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
              AccèsUniversity
            </span>
          </Link>

          {/* Desktop Center Menu */}
          <div className="hidden lg:flex items-center bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-gray-200/50 shadow-sm">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.href)
                  ? 'bg-white text-electric-600 shadow-md shadow-gray-200/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100/50'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Separator */}
            <div className="w-px h-4 bg-gray-300 mx-2"></div>

            {/* Dropdown for More */}
            <div className="relative group">
              <button className="px-3 py-2 text-slate-500 hover:text-slate-900 flex items-center gap-1 text-sm font-medium">
                Plus
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                {secondaryLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-slate-600 hover:text-electric-600 hover:bg-electric-50 rounded-xl transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2">
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-colors shadow-lg shadow-slate-900/20"
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard/student"
                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-electric-200 pl-2 pr-4 py-1.5 rounded-full transition-colors shadow-sm"
              >
                <div className="w-7 h-7 bg-electric-100 text-electric-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {user.firstName ? user.firstName[0] : 'U'}
                </div>
                <span className="text-sm font-semibold text-slate-700">Mon Espace</span>
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 overflow-y-auto lg:hidden"
          >
            <div className="flex flex-col gap-2">
              {[...navLinks, ...secondaryLinks].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold text-slate-900 py-4 border-b border-gray-100"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-8 flex flex-col gap-4">
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center border-2 border-slate-200 rounded-2xl font-bold text-slate-700">
                  Connexion
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center bg-electric-600 text-white rounded-2xl font-bold">
                  Inscription Gratuite
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
