'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function PartenairesPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-20">

            {/* Hero Section */}
            <section className="bg-midnight-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric-600/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-electric-900/50 border border-electric-700 rounded-full text-electric-300 text-sm font-medium mb-6">
                            Pour les établissements d'enseignement supérieur
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                            Recrutez vos futurs <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-400 to-purple-400">talents d'exception</span>
                        </h1>
                        <p className="text-slate-400 text-lg mb-8 max-w-lg">
                            Accédez à une base qualifiée d'étudiants motivés. Simplifiez vos processus d'admission et améliorez votre visibilité.
                        </p>
                        <div className="flex gap-4">
                            <a href="#contact" className="px-8 py-3 bg-white text-midnight-900 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                                Nous contacter
                            </a>
                            <a href="#benefits" className="px-8 py-3 bg-transparent border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                                En savoir plus
                            </a>
                        </div>
                    </div>
                    <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden glass-dark border border-white/10 p-8">
                        {/* Mockup or Abstract representation of analytics */}
                        <div className="w-full h-full bg-slate-800/50 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-12 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-slate-700 rounded"></div>
                                        <div className="h-8 w-16 bg-electric-500 rounded"></div>
                                    </div>
                                    <div className="h-4 w-24 bg-electric-500/20 rounded text-electric-400 text-xs flex items-center justify-center">+24% cette semaine</div>
                                </div>
                                <div className="space-y-4">
                                    {[100, 75, 50, 25].map(w => (
                                        <div key={w} className="space-y-1">
                                            <div className="flex justify-between text-xs text-slate-500">
                                                <span>Ingénierie</span>
                                                <span>{w}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-electric-500 rounded-full" style={{ width: `${w}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-24">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Pourquoi devenir partenaire ?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">Nous vous offrons les outils pour moderniser votre recrutement étudiant.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-blue-100/50 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Candidats Qualifiés</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Nos algorithmes de matching vous proposent uniquement des profils pertinents correspondants à vos critères d'admission.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-purple-100/50 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Tableau de Bord</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Suivez en temps réel le nombre de vues, les clics et les dossiers soumis pour vos formations.
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-12 h-12 bg-orange-100/50 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Markéting Digital</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Profitez de nos campagnes ciblées pour mettre en avant vos journées portes ouvertes et vos programmes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="py-24 bg-slate-100">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Devenir Partenaire</h2>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'établissement</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none transition-all" placeholder="Université de..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                    <select className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-electric-500 focus:border-transparent outline-none transition-all">
                                        <option>Université</option>
                                        <option>Grande École</option>
                                        <option>École Spécialisée</option>
                                        <option>Autre</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Contact (Nom)</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-electric-500 outline-none" placeholder="Jean Dupont" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Professionnel</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-electric-500 outline-none" placeholder="jean@ecole.com" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-electric-500 outline-none" placeholder="Parlez-nous de vos besoins de recrutement..."></textarea>
                            </div>

                            <button type="submit" className="w-full bg-electric-600 text-white font-bold py-4 rounded-lg hover:bg-electric-700 transition-colors shadow-lg shadow-electric-500/30">
                                Envoyer la demande
                            </button>
                        </form>
                    </div>
                </div>
            </section>

        </div>
    )
}
