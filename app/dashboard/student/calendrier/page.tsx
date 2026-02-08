'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import EmptyState from '@/components/ui/EmptyState'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Link from 'next/link'

interface Application {
  id: string
  status: string
  deadline?: string
  interviewDate?: string
  resultDate?: string
  school: {
    id: string
    name: string
    country: string
    city?: string
  }
}

export default function StudentCalendarPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Erreur lors du chargement des candidatures')
      }

      const data = await res.json()
      setApplications(data || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return applications.filter(app => {
      if (app.deadline && app.deadline.split('T')[0] === dateStr) return true
      if (app.interviewDate && app.interviewDate.split('T')[0] === dateStr) return true
      if (app.resultDate && app.resultDate.split('T')[0] === dateStr) return true
      return false
    })
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

  const upcomingEvents = applications
    .flatMap(app => [
      app.deadline ? { date: app.deadline, type: 'deadline', app } : null,
      app.interviewDate ? { date: app.interviewDate, type: 'interview', app } : null,
      app.resultDate ? { date: app.resultDate, type: 'result', app } : null,
    ])
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10)

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement du calendrier..." />
  }

  return (
    <div className="max-w-7xl mx-auto animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Calendrier' },
        ]}
        className="mb-6"
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Calendrier de Candidatures</h1>
        <p className="mt-2 text-gray-600">Suivez toutes vos dates importantes</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onClose={() => setError('')} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const date = new Date(year, month, day)
              const events = getEventsForDate(date)
              const isToday = date.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={day}
                  className={`aspect-square border border-gray-200 rounded-lg p-1 ${
                    isToday ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {events.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-1 py-0.5 rounded truncate ${
                          event.deadline ? 'bg-red-100 text-red-700' :
                          event.interviewDate ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}
                        title={event.school.name}
                      >
                        {event.deadline ? '📅' : event.interviewDate ? '💼' : '✅'}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-gray-500">+{events.length - 2}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Événements à venir */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Événements à venir</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-600 text-sm">Aucun événement à venir</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event: any, idx) => (
                <Link
                  key={idx}
                  href={`/dashboard/student/ecoles/${event.app.school.id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {event.type === 'deadline' ? '📅' : event.type === 'interview' ? '💼' : '✅'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {event.app.school.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {event.type === 'deadline' ? 'Deadline' : event.type === 'interview' ? 'Entretien' : 'Résultat'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

