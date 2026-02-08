'use client'

import { useState, useEffect } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import EmptyState from '@/components/ui/EmptyState'
import SuccessToast from '@/components/ui/SuccessToast'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

interface FileUpload {
  id: string
  fileName: string
  filePath: string
  fileType: string
  category?: string
  createdAt: string
}

export default function StudentDocumentsPage() {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      setIsPremium(!!user.isPremium)
    }
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      setError('')
      const token = localStorage.getItem('token')

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/dashboard/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Erreur lors du chargement des documents')
      }

      const data = await res.json()
      setFiles(data.files || [])
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erreur lors du chargement des documents')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium) {
      setError('Cette fonctionnalité est réservée aux membres Premium.')
      e.target.value = ''
      return
    }

    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', file)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Erreur lors de l\'upload du fichier')
      }

      setSuccess('Fichier uploadé avec succès')
      fetchFiles()
      e.target.value = ''
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'upload'
      setError(message)
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (fileId: string, fileName: string, view: boolean = false) => {
    setActionLoading(fileId)
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/upload/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Erreur lors du téléchargement')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      if (view) {
        window.open(url, '_blank')
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
      }

      // Cleanup URL after a delay to ensure view/download started
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)

    } catch (err) {
      setError('Impossible de télécharger le fichier')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;

    setActionLoading(fileId)
    try {
      const token = localStorage.getItem('token')
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      const res = await fetch(`${apiUrl}/api/upload/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error('Erreur suppression')

      setSuccess('Fichier supprimé')
      setFiles(prev => prev.filter(f => f.id !== fileId))
    } catch (err) {
      setError('Erreur lors de la suppression')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="Chargement de vos documents..." />
  }

  return (
    <div className="max-w-7xl mx-auto animate-page-enter">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard/student' },
          { label: 'Mes Documents' },
        ]}
        className="mb-6"
      />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Documents</h1>
          <p className="mt-2 text-gray-600">Gérez vos documents uploadés</p>
        </div>
        <div className="flex flex-col items-end">
          <label className={`px-4 py-2 text-white rounded-lg font-semibold transition-colors cursor-pointer ${isPremium ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}>
            {uploading ? 'Upload en cours...' : 'Télécharger un document'}
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading || !isPremium}
            />
          </label>
          {!isPremium && (
            <span className="text-xs text-red-500 mt-1">Réservé aux membres Premium</span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onClose={() => setError('')} />
        </div>
      )}

      {success && (
        <div className="mb-6">
          <SuccessToast message={success} onClose={() => setSuccess('')} />
        </div>
      )}

      {files.length === 0 ? (
        <EmptyState
          title="Aucun document"
          description={isPremium ? "Vous n'avez pas encore uploadé de documents." : "Passez Premium pour uploader vos documents."}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nom du fichier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date d&apos;upload
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{file.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(file.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleDownload(file.id, file.fileName, true)}
                          disabled={actionLoading === file.id}
                          className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                          title="Voir"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button
                          onClick={() => handleDownload(file.id, file.fileName, false)}
                          disabled={actionLoading === file.id}
                          className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                          title="Télécharger"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          disabled={actionLoading === file.id}
                          className="text-gray-500 hover:text-red-600 transition-colors p-1"
                          title="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
