'use client'

import React from 'react';
import Link from 'next/link';

export default function SchoolDashboard() {
    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
                <h1 className="text-3xl font-bold text-slate-900">Tableau de bord École</h1>
                <p className="text-slate-500 mt-2">Gérez votre établissement et vos candidatures.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-blue-900 font-semibold mb-2">Candidatures reçues</h3>
                        <p className="text-4xl font-bold text-blue-600">0</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <h3 className="text-purple-900 font-semibold mb-2">Vues du profil</h3>
                        <p className="text-4xl font-bold text-purple-600">0</p>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                        <h3 className="text-amber-900 font-semibold mb-2">Score de complétion</h3>
                        <p className="text-4xl font-bold text-amber-600">20%</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Actions rapides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/dashboard/school/profile" className="p-4 border rounded-lg hover:bg-slate-50 text-center text-slate-700 font-medium">
                        Modifier la fiche école
                    </Link>
                    <Link href="/dashboard/school/candidatures" className="p-4 border rounded-lg hover:bg-slate-50 text-center text-slate-700 font-medium">
                        Voir les candidats
                    </Link>
                    <Link href="/dashboard/school/stats" className="p-4 border rounded-lg hover:bg-slate-50 text-center text-slate-700 font-medium">
                        Statistiques détaillées
                    </Link>
                </div>
            </div>
        </div>
    );
}
