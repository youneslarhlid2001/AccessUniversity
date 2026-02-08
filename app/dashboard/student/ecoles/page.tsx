'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import EmptyState from '@/components/ui/EmptyState'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { Search, Filter, Heart, MapPin, ExternalLink } from 'lucide-react'

interface Recommendation {
  id: string
  score: number
  school: {
    id: string
    name: string
    country: string
    city?: string
    imageUrl?: string
    description?: string
  }
}

export default function StudentSchoolsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('All')

  // Favorites State
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [favoritesLoading, setFavoritesLoading] = useState(false)

  useEffect(() => {
    Promise.all([fetchRecommendations(), fetchFavorites()])
      .finally(() => setLoading(false))
  }, [])

  const fetchRecommendations = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/dashboard/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Erreur lors du chargement des recommandations')
      }

      const data = await res.json()
      setRecommendations(data.recommendations || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des recommandations')
    }
  }

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        const favIds = new Set<string>(data.map((fav: any) => fav.school.id))
        setFavorites(favIds)
      }
    } catch (err) {
      console.error('Error fetching favorites', err)
    }
  }

  const toggleFavorite = async (e: React.MouseEvent, schoolId: string) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()

    if (favoritesLoading) return
    setFavoritesLoading(true)

    try {
      const token = localStorage.getItem('token')
      const isFav = favorites.has(schoolId)
      const method = isFav ? 'DELETE' : 'POST'
      const url = isFav
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/favorites/${schoolId}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/favorites`

      const body = isFav ? undefined : JSON.stringify({ schoolId })

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body
      })

      if (res.ok) {
        setFavorites(prev => {
          const next = new Set(prev)
          if (isFav) next.delete(schoolId)
          else next.add(schoolId)
          return next
        })
      }
    } catch (err) {
      console.error('Error toggling favorite', err)
    } finally {
      setFavoritesLoading(false)
    }
  }

  // Filter Logic
  const filteredRecommendations = recommendations.filter(rec => {
    const matchesSearch = rec.school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.school.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = selectedCountry === 'All' || rec.school.country === selectedCountry
    return matchesSearch && matchesCountry
  })

  // Get unique countries for filter
  const countries = ['All', ...Array.from(new Set(recommendations.map(r => r.school.country)))]

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement de vos écoles recommandées..." />
  }

  return (
    <div className="max-w-7xl mx-auto animate-page-enter pb-16">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Mes Écoles' },
        ]}
        className="mb-8"
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Catalogue Personnalisé</h1>
          <p className="text-gray-600">Explorez les écoles sélectionnées pour votre profil</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-electric-500 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher une école..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 w-full sm:w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-electric-500/20 focus:border-electric-500 appearance-none cursor-pointer hover:border-gray-300 transition-colors"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countries.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'Tous les pays' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onClose={() => setError('')} />
        </div>
      )}

      {recommendations.length === 0 ? (
        <EmptyState
          title="Aucune recommandation"
          description="Complétez votre orientation pour recevoir des recommandations personnalisées d'écoles"
          action={{
            label: "Faire mon orientation",
            onClick: () => window.location.href = "/dashboard/student/orientation/new"
          }}
        />
      ) : filteredRecommendations.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">🔍</div>
          <h3 className="text-lg font-bold text-gray-900">Aucun résultat trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos filtres de recherche.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCountry('All') }}
            className="mt-4 text-electric-600 font-semibold hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((rec) => (
            <Link
              key={rec.id}
              href={`/dashboard/student/ecoles/${rec.school.id}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-electric-900/5 hover:border-electric-200 transition-all duration-300 overflow-hidden flex flex-col relative"
            >
              {/* Favorite Button */}
              <button
                onClick={(e) => toggleFavorite(e, rec.school.id)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-110 active:scale-95 transition-all group/fav"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${favorites.has(rec.school.id) ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/fav:text-red-500'}`}
                />
              </button>

              {rec.school.imageUrl ? (
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={rec.school.imageUrl}
                    alt={rec.school.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-electric-700 shadow-sm">
                    {rec.score}% Match
                  </div>
                </div>
              ) : (
                <div className="aspect-[4/3] w-full bg-slate-50 flex items-center justify-center relative">
                  <div className="text-6xl font-black text-slate-200 select-none">
                    {rec.school.name[0]}
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold text-electric-700 shadow-sm">
                    {rec.score}% Match
                  </div>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-electric-600 transition-colors line-clamp-1 mb-1">
                    {rec.school.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {rec.school.city ? `${rec.school.city}, ` : ''}{rec.school.country}
                  </div>
                </div>

                {rec.school.description && (
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {rec.school.description}
                  </p>
                )}

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-electric-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Voir détails <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
