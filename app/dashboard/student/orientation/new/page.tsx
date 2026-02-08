'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ErrorMessage from '@/components/ui/ErrorMessage'
import SuccessToast from '@/components/ui/SuccessToast'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function NewOrientationPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        level: '',
        country: '',
        objectives: '',
        profile: '',
    })

    // Pas de localStorage ici pour éviter de partager l'état avec la page publique par erreur
    // Ou on peut l'utiliser avec une clé spécifique 'dashboard_orientation_progress'

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [recommendations, setRecommendations] = useState<any[]>([])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleNext = () => {
        setError('')
        if (step === 1 && !formData.level) {
            setError('Veuillez sélectionner votre niveau d\'études pour continuer')
            return
        }
        if (step === 2 && !formData.country) {
            setError('Veuillez sélectionner un pays pour continuer')
            return
        }
        setStep(step + 1)
    }

    const handlePrevious = () => {
        setError('')
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (!formData.level || !formData.country || !formData.objectives || !formData.profile) {
                setError('Veuillez remplir tous les champs pour continuer')
                return
            }

            const token = localStorage.getItem('token')
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 15000)

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/orientation`, {
                method: 'POST',
                headers,
                body: JSON.stringify(formData),
                signal: controller.signal
            })

            clearTimeout(timeoutId)
            const data = await res.json()

            if (!res.ok) {
                let errorMessage = 'Erreur lors de l\'orientation'
                if (res.status >= 500) {
                    errorMessage = 'Le serveur rencontre des difficultés. Veuillez réessayer dans quelques instants.'
                } else if (data.message) {
                    errorMessage = data.message
                }
                throw new Error(errorMessage)
            }

            setRecommendations(data.recommendations || [])
            setShowSuccess(true)
            setStep(4)
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setError('La connexion prend trop de temps. Vérifiez votre connexion internet et réessayez.')
            } else {
                setError(err.message || 'Une erreur est survenue lors de l\'orientation. Veuillez réessayer.')
            }
        } finally {
            setLoading(false)
        }
    }

    const steps = [
        { number: 1, title: 'Niveau', icon: '🎓' },
        { number: 2, title: 'Destination', icon: '🌍' },
        { number: 3, title: 'Profil', icon: '👤' },
        { number: 4, title: 'Résultats', icon: '✨' },
    ]

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
    }

    return (
        <div className="max-w-5xl mx-auto pb-12 animate-page-enter">
            <Breadcrumbs
                items={[
                    { label: 'Dashboard', href: '/dashboard/student' },
                    { label: 'Mon Orientation', href: '/dashboard/student/orientation' },
                    { label: 'Nouvelle Analyse' },
                ]}
                className="mb-8"
            />

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Nouvelle <span className="text-gradient">Orientation</span>
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto">
                    Laissez notre algorithme analyser votre profil pour identifier les meilleures opportunités.
                </p>
            </div>

            {/* Progress Bar (Visual) */}
            <div className="mb-12 relative max-w-3xl mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 rounded-full -z-10"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-electric-500 to-purple-500 rounded-full -z-10 transition-all duration-500"
                    style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                <div className="flex justify-between w-full">
                    {steps.map((s) => (
                        <div key={s.number} className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-4 transition-all duration-300 ${step >= s.number
                                ? 'bg-white border-electric-500 text-electric-600 scale-110 shadow-lg shadow-electric-500/20'
                                : 'bg-white border-slate-200 text-slate-300'
                                }`}>
                                {step > s.number ? '✓' : s.number}
                            </div>
                            <span className={`text-xs font-semibold uppercase tracking-wider ${step >= s.number ? 'text-electric-600' : 'text-slate-300'
                                }`}>{s.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative min-h-[500px] flex flex-col">

                {/* Notifications */}
                <div className="absolute top-0 left-0 w-full z-50">
                    {error && <ErrorMessage message={error} onClose={() => setError('')} autoClose={false} />}
                    {showSuccess && <SuccessToast message="Analyse terminée avec succès !" onClose={() => setShowSuccess(false)} />}
                </div>

                <div className="p-8 md:p-12 flex-grow flex flex-col justify-center">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: LEVEL */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-slate-800">Quel est votre niveau actuel ?</h2>
                                    <p className="text-slate-500">Pour commencer, dites-nous où vous en êtes dans vos études.</p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                    {['bac', 'bac+2', 'bac+3', 'bac+5'].map((level) => (
                                        <label
                                            key={level}
                                            className={`relative group cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${formData.level === level
                                                ? 'border-electric-500 bg-electric-50/50 shadow-lg shadow-electric-500/10'
                                                : 'border-slate-100 hover:border-electric-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="level"
                                                value={level}
                                                checked={formData.level === level}
                                                onChange={handleChange}
                                                className="peer sr-only"
                                            />
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-bold text-slate-700 uppercase tracking-wide group-hover:text-electric-700 transition-colors">
                                                    {level}
                                                </span>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.level === level ? 'border-electric-500 bg-electric-500' : 'border-slate-300'
                                                    }`}>
                                                    {formData.level === level && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-4 max-w-2xl mx-auto w-full">
                                    <button onClick={handleNext} className="btn-primary group">
                                        Continuer
                                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: COUNTRY */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-slate-800">Destination de rêve 🌍</h2>
                                    <p className="text-slate-500">Où souhaitez-vous étudier ?</p>
                                </div>

                                <div className="max-w-md mx-auto">
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-xl border-2 border-slate-200 bg-white text-lg focus:border-electric-500 focus:ring-4 focus:ring-electric-500/10 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="">Sélectionnez un pays...</option>
                                        <option value="France">🇫🇷 France</option>
                                        <option value="Canada">🇨🇦 Canada</option>
                                        <option value="Belgique">🇧🇪 Belgique</option>
                                        <option value="Suisse">🇨🇭 Suisse</option>
                                        <option value="Royaume-Uni">🇬🇧 Royaume-Uni</option>
                                        <option value="États-Unis">🇺🇸 États-Unis</option>
                                    </select>
                                </div>

                                <div className="flex justify-between pt-8 max-w-md mx-auto w-full">
                                    <button onClick={handlePrevious} className="btn-secondary">
                                        Précédent
                                    </button>
                                    <button onClick={handleNext} className="btn-primary group">
                                        Continuer
                                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: PROFILE & OBJECTIVES */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Parlez-nous de vous</h2>
                                    <p className="text-slate-500">Plus nous en savons, meilleures seront nos recommandations.</p>
                                </div>

                                <div className="space-y-4 max-w-2xl mx-auto w-full">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Vos objectifs professionnels</label>
                                        <textarea
                                            name="objectives"
                                            value={formData.objectives}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:border-electric-500 focus:ring-4 focus:ring-electric-500/10 outline-none transition-all resize-none"
                                            placeholder="Ex: Je souhaite devenir ingénieur en IA..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Votre parcours & atouts</label>
                                        <textarea
                                            name="profile"
                                            value={formData.profile}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full p-4 rounded-xl border border-slate-200 focus:border-electric-500 focus:ring-4 focus:ring-electric-500/10 outline-none transition-all resize-none"
                                            placeholder="Ex: Bonnes notes en maths, passionné de code..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between pt-4 max-w-2xl mx-auto w-full">
                                    <button onClick={handlePrevious} className="btn-secondary">
                                        Précédent
                                    </button>
                                    <button
                                        onClick={(e) => handleSubmit(e)}
                                        disabled={loading}
                                        className="btn-primary w-full sm:w-auto relative overflow-hidden"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analyse en cours...
                                            </span>
                                        ) : (
                                            "Lancer l'analyse"
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: RESULTS */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">🎉 Match trouvé !</h2>
                                    <p className="text-slate-500">Voici les établissements qui correspondent parfaitement à votre profil.</p>
                                </div>

                                {recommendations.length > 0 ? (
                                    <div className="grid gap-6 max-w-3xl mx-auto">
                                        {recommendations.map((rec) => (
                                            <Link
                                                href={`/dashboard/student/ecoles/${rec.schoolId}`}
                                                key={rec.id}
                                                className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-electric-500/10 hover:border-electric-200 transition-all duration-300 relative overflow-hidden"
                                            >
                                                <div className="flex justify-between items-start gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-electric-600 transition-colors">
                                                                {rec.school?.name || "École Partenaire"}
                                                            </h3>
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                                {rec.score}% Match
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                                            {rec.school?.description || "Une école d'excellence pour votre avenir."}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                {rec.school?.country || "France"}
                                                            </span>
                                                            {rec.school?.price && (
                                                                <span className="flex items-center gap-1">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    {rec.school.price}€ / an
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-electric-500 group-hover:text-white transition-all">
                                                        →
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🤷‍♂️</div>
                                        <h3 className="text-lg font-bold text-slate-700">Aucun résultat exact</h3>
                                        <p className="text-slate-500 mb-6">Nous n'avons pas trouvé de correspondance parfaite, mais ne vous découragez pas !</p>
                                        <button onClick={() => setStep(1)} className="text-electric-600 font-semibold hover:underline">Modifier mes critères</button>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
                                    <Link href="/dashboard/student/ecoles" className="btn-secondary text-center">Voir tout le catalogue</Link>
                                    <Link href="/dashboard/student" className="btn-primary text-center">Terminer</Link>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            <style jsx global>{`
        .btn-primary {
          @apply px-6 py-3 bg-electric-600 text-white rounded-xl font-semibold shadow-lg shadow-electric-500/30 hover:bg-electric-500 hover:shadow-electric-500/40 hover:-translate-y-0.5 transition-all active:scale-95;
        }
        .btn-secondary {
          @apply px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-95;
        }
      `}</style>
        </div>
    )
}
