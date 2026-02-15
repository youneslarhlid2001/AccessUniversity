import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-electric-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    A
                                </div>
                                <span className="text-xl font-bold text-white tracking-tight">AccèsUniversity</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            La plateforme d'élite qui connecte les talents ambitieux aux établissements les plus prestigieux du monde.
                        </p>
                        <div className="flex gap-4">
                            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-electric-600 hover:text-white transition-all duration-300"
                                >
                                    <span className="sr-only">{social}</span>
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Navigation</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/" className="hover:text-electric-400 transition-colors">Accueil</Link></li>
                            <li><Link href="/ecoles" className="hover:text-electric-400 transition-colors">Écoles</Link></li>
                            <li><Link href="/orientation" className="hover:text-electric-400 transition-colors">Orientation</Link></li>
                            <li><Link href="/logement" className="hover:text-electric-400 transition-colors">Logement</Link></li>
                            <li><Link href="/blog" className="hover:text-electric-400 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Legal/Support Column */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Support</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/contact" className="hover:text-electric-400 transition-colors">Nous contacter</Link></li>
                            <li><Link href="/faq" className="hover:text-electric-400 transition-colors">FAQ</Link></li>
                            <li><Link href="/mentions-legales" className="hover:text-electric-400 transition-colors">Mentions légales</Link></li>
                            <li><Link href="/confidentialite" className="hover:text-electric-400 transition-colors">Politique de confidentialité</Link></li>
                            <li><Link href="/cgu" className="hover:text-electric-400 transition-colors">CGU</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter/Contact Column */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Restez informé</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Recevez nos dernières actualités et conseils pour votre orientation.
                        </p>
                        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Votre email"
                                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 text-sm transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-2.5 bg-electric-600 hover:bg-electric-700 text-white font-semibold rounded-lg text-sm transition-all shadow-lg hover:shadow-electric-500/20"
                            >
                                S'inscrire
                            </button>
                        </form>
                    </div>

                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {currentYear} AccèsUniversity. Tous droits réservés.</p>
                    <div className="flex gap-6">
                        <Link href="/plan-du-site" className="hover:text-slate-300">Plan du site</Link>
                        <Link href="/cookies" className="hover:text-slate-300">Gestion des cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
