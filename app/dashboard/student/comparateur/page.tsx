'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import EmptyState from '@/components/ui/EmptyState'

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

export default function StudentComparatorPage() {
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])
  const [schoolsData, setSchoolsData] = useState<School[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (selectedSchools.length > 0) {
      fetchSchoolsData()
    }
  }, [selectedSchools])

  const fetchSchoolsData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const promises = selectedSchools.map(id =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/schools/${id}`)
          .then(res => res.ok ? res.json() : null)
      )
      
      const results = await Promise.all(promises)
      setSchoolsData(results.filter(Boolean))
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des écoles')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSchool = (schoolId: string) => {
    if (selectedSchools.length >= 4) {
      setError('Vous ne pouvez comparer que 4 écoles maximum')
      return
    }
    if (!selectedSchools.includes(schoolId)) {
      setSelectedSchools([...selectedSchools, schoolId])
    }
  }

  const handleRemoveSchool = (schoolId: string) => {
    setSelectedSchools(selectedSchools.filter(id => id !== schoolId))
    setSchoolsData(schoolsData.filter(s => s.id !== schoolId))
  }

  // Récupérer les écoles recommandées pour la sélection
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/dashboard/student`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setRecommendations(data.recommendations || [])
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err)
      }
    }
    fetchRecommendations()
  }, [])

  return (
    <div className="max-w-7xl mx-auto animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Comparateur' },
        ]}
        className="mb-6"
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Comparateur d&apos;Écoles</h1>
        <p className="mt-2 text-gray-600">Comparez jusqu&apos;à 4 écoles côte à côte</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onClose={() => setError('')} />
        </div>
      )}

      {/* Sélection d'écoles */}
      {selectedSchools.length < 4 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ajouter des écoles à comparer</h2>
          {recommendations.length === 0 ? (
            <p className="text-gray-600">Aucune école recommandée disponible</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations
                .filter(rec => !selectedSchools.includes(rec.school.id))
                .map(rec => (
                  <button
                    key={rec.school.id}
                    onClick={() => handleAddSchool(rec.school.id)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">{rec.school.name}</h3>
                    <p className="text-sm text-gray-600">
                      {rec.school.city ? `${rec.school.city}, ` : ''}{rec.school.country}
                    </p>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Comparaison */}
      {loading ? (
        <LoadingSpinner text="Chargement des écoles..." />
      ) : schoolsData.length === 0 ? (
        <EmptyState
          title="Aucune école sélectionnée"
          description="Ajoutez des écoles à comparer en utilisant le sélecteur ci-dessus"
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Critère</th>
                  {schoolsData.map(school => (
                    <th key={school.id} className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-[200px]">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900">{school.name}</div>
                          <button
                            onClick={() => handleRemoveSchool(school.id)}
                            className="text-xs text-red-600 hover:text-red-700 mt-1"
                          >
                            Retirer
                          </button>
                        </div>
                        {school.imageUrl && (
                          <img
                            src={school.imageUrl}
                            alt={school.name}
                            className="w-12 h-12 rounded-lg object-cover ml-2"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Localisation</td>
                  {schoolsData.map(school => (
                    <td key={school.id} className="px-6 py-4 text-gray-600">
                      {school.city ? `${school.city}, ` : ''}{school.country}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Frais de scolarité</td>
                  {schoolsData.map(school => (
                    <td key={school.id} className="px-6 py-4 text-gray-600">
                      {school.price 
                        ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(school.price) + '/an'
                        : 'Non renseigné'
                      }
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Description</td>
                  {schoolsData.map(school => (
                    <td key={school.id} className="px-6 py-4 text-gray-600 text-sm">
                      <p className="line-clamp-3">{school.description}</p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Programme</td>
                  {schoolsData.map(school => (
                    <td key={school.id} className="px-6 py-4 text-gray-600 text-sm">
                      <p className="line-clamp-3">{school.program}</p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Site web</td>
                  {schoolsData.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      {school.website ? (
                        <a
                          href={school.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Visiter
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">Non disponible</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-gray-900">Actions</td>
                  {schoolsData.map(school => (
                    <td key={school.id} className="px-6 py-4">
                      <Link
                        href={`/dashboard/student/ecoles/${school.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Voir détails
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

