import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stethoscope, Video, Calendar, Shield, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-famalink-blue-700">
            <Stethoscope className="h-6 w-6" />
            <span>FamaLink</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-famalink-blue-700">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-famalink-blue-700">
              Tarifs
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-famalink-blue-700">
              Témoignages
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-famalink-blue-700">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>Essai gratuit</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-famalink-blue-50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              La télésanté simplifiée pour l&apos;Afrique
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              FamaLink connecte les médecins et les patients grâce à une plateforme intuitive 
              de consultations à distance, adaptée aux réalités africaines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Voir une démo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités conçues pour les professionnels de santé
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre plateforme vous offre tous les outils nécessaires pour gérer efficacement 
              vos consultations à distance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-famalink-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-famalink-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Téléconsultations HD</h3>
              <p className="text-gray-600">
                Consultations vidéo fluides et sécurisées, même avec une connexion internet limitée.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-famalink-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-famalink-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestion des rendez-vous</h3>
              <p className="text-gray-600">
                Planifiez et gérez facilement vos consultations avec un calendrier intelligent.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-famalink-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-famalink-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dossiers patients</h3>
              <p className="text-gray-600">
                Créez et accédez facilement aux dossiers médicaux de vos patients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-famalink-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-famalink-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurité des données</h3>
              <p className="text-gray-600">
                Vos données et celles de vos patients sont chiffrées et sécurisées.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-famalink-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-famalink-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi médical</h3>
              <p className="text-gray-600">
                Suivez l'évolution de vos patients et gérez leurs traitements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-famalink-blue-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à transformer votre pratique médicale ?
          </h2>
          <p className="text-xl text-famalink-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines de professionnels de santé qui utilisent déjà FamaLink pour leurs consultations à distance.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 font-bold text-xl text-white mb-4">
                <Stethoscope className="h-6 w-6" />
                <span>FamaLink</span>
              </div>
              <p className="max-w-xs">
                Solution de télésanté simplifiée pour l&apos;Afrique
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Produit</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-white">Fonctionnalités</Link></li>
                  <li><Link href="#" className="hover:text-white">Tarifs</Link></li>
                  <li><Link href="#" className="hover:text-white">Témoignages</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Ressources</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-white">Documentation</Link></li>
                  <li><Link href="#" className="hover:text-white">Blog</Link></li>
                  <li><Link href="#" className="hover:text-white">Support</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Entreprise</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="hover:text-white">À propos</Link></li>
                  <li><Link href="#" className="hover:text-white">Carrières</Link></li>
                  <li><Link href="#" className="hover:text-white">Contact</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 mt-6 text-sm text-center md:text-left md:flex md:justify-between">
            <p>&copy; {new Date().getFullYear()} FamaLink. Tous droits réservés.</p>
            <div className="mt-4 md:mt-0">
              <Link href="#" className="hover:text-white mr-4">Conditions d&apos;utilisation</Link>
              <Link href="#" className="hover:text-white">Politique de confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}