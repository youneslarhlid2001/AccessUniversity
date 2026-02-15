'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ErrorMessage from '@/components/ui/ErrorMessage'
import FormField from '@/components/ui/FormField'
import SuccessToast from '@/components/ui/SuccessToast'

export default function RegisterSchoolPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        schoolName: '',
        schoolWebsite: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<any>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Validation simple
            if (!formData.email || !formData.password || !formData.schoolName) {
                setError('Tous les champs marqués * sont obligatoires')
                return
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/register-school`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Erreur lors de l'inscription")
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))

            setShowSuccess(true)

            setTimeout(() => {
                router.push('/dashboard/school') // Redirection vers le dashboard école
            }, 1500)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center px-4 py-12">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-2xl w-full relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center space-x-2 mb-4">
                        <div className="w-10 h-10 bg-electric-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">AU</span>
                        </div>
                        <span className="text-2xl font-bold text-white">AccèsUniversity</span>
                    </Link>
                    <h2 className="text-3xl font-bold text-white mb-2">Espace Établissement</h2>
                    <p className="text-slate-400">Rejoignez le réseau des meilleures écoles</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {error && <ErrorMessage message={error} onClose={() => setError('')} />}
                    {showSuccess && <SuccessToast message="Compte école créé avec succès !" onClose={() => setShowSuccess(false)} />}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-electric-400 font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">L'Établissement</h3>
                                <FormField
                                    label="Nom de l'école *"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    placeholder="Ex: HEC Paris"
                                    required
                                    className="bg-slate-800/50 border-slate-700 text-white focus:border-electric-500"
                                    labelClassName="text-slate-300"
                                />
                                <FormField
                                    label="Site Web"
                                    name="schoolWebsite"
                                    value={formData.schoolWebsite}
                                    onChange={handleChange}
                                    placeholder="https://www.hec.edu"
                                    className="bg-slate-800/50 border-slate-700 text-white focus:border-electric-500"
                                    labelClassName="text-slate-300"
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-electric-400 font-semibold text-sm uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Le Responsable</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        label="Prénom *"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="bg-slate-800/50 border-slate-700 text-white focus:border-electric-500"
                                        labelClassName="text-slate-300"
                                    />
                                    <FormField
                                        label="Nom *"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="bg-slate-800/50 border-slate-700 text-white focus:border-electric-500"
                                        labelClassName="text-slate-300"
                                    />
                                </div>
                                <FormField
                                    label="Email Professionnel *"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="bg-slate-800/50 border-slate-700 text-white focus:border-electric-500"
                                    labelClassName="text-slate-300"
                                />
                                <FormField
                                    label="Mot de passe *"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="bg-slate-800/50 border-slate-700 text-white focus:border-electric-500"
                                    labelClassName="text-slate-300"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-electric-600 hover:bg-electric-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-electric-500/20 mt-8"
                        >
                            {loading ? 'Création en cours...' : 'Créer mon compte école'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-400 text-sm">
                        Vous êtes un étudiant ? <Link href="/register" className="text-electric-400 hover:text-electric-300 font-semibold">Inscription étudiant</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
