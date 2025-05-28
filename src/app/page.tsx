import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">F</div>
            <span className="ml-2 text-xl font-bold text-blue-900">FamaLink</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Fonctionnalités</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">À propos</a></li>
              <li><Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">Connexion</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
                La télémédecine adaptée aux besoins de l'Afrique
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connectez-vous avec vos patients, gérez vos rendez-vous et consultations médicales en toute simplicité.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard" 
                  className="btn-primary btn-lg"
                >
                  Accéder au Dashboard
                </Link>
                <Link 
                  href="/login" 
                  className="btn-secondary btn-lg"
                >
                  Se connecter
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-80 w-full">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl transform rotate-3"></div>
                <div className="absolute inset-0 bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Plateforme de télésanté</h2>
                    <p className="text-gray-600">Optimisée pour les réseaux à faible bande passante et les zones rurales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section id="features" className="py-12">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Fonctionnalités principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Téléconsultations</h3>
                <p className="text-gray-600">Consultations vidéo optimisées pour les connexions lentes</p>
              </div>
              
              <div className="card text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gestion des RDV</h3>
                <p className="text-gray-600">Planifiez et gérez facilement vos rendez-vous</p>
              </div>
              
              <div className="card text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dossiers médicaux</h3>
                <p className="text-gray-600">Gestion sécurisée des dossiers patients</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600">
            FamaLink © {new Date().getFullYear()} - Solution de télésanté pour l'Afrique 🌍
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Version MVP - En développement
          </p>
        </footer>
      </div>
    </div>
  )
}