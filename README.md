# 🏥 FamaLink MVP
> Solution de Télésanté Simplifiée pour l'Afrique

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Description

FamaLink MVP est une plateforme de télésanté simplifiée conçue spécifiquement pour les médecins en Afrique. Elle permet la gestion des patients, la prise de rendez-vous et les téléconsultations vidéo dans un environnement sécurisé et adapté aux contraintes locales.

### 🎯 Objectif du MVP
Valider le concept avec 3 médecins généralistes à Abidjan en proposant les fonctionnalités essentielles pour moderniser leur pratique médicale.

## ✨ Fonctionnalités

### 👥 Gestion des Patients
- ✅ Création et modification de profils patients
- ✅ Historique des consultations
- ✅ Recherche rapide par nom ou téléphone
- ✅ Export des données patient

### 📅 Système de Rendez-vous
- ✅ Calendrier médecin intuitif (vue semaine)
- ✅ Prise de RDV en ligne
- ✅ Notifications SMS automatiques (rappel J-1)
- ✅ Gestion des annulations

### 💻 Téléconsultation
- ✅ Vidéoconférence HD avec Daily.co
- ✅ Chat en temps réel
- ✅ Prise de notes pendant la consultation
- ✅ Sauvegarde automatique des consultations

### 🔐 Sécurité
- ✅ Authentification sécurisée
- ✅ Chiffrement des données médicales
- ✅ Conformité RGPD
- ✅ Sessions sécurisées

## 🚀 Démarrage Rapide

### Prérequis
```bash
Node.js >= 18.0.0
npm >= 8.0.0
Git
```

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/famalink-mvp.git
cd famalink-mvp
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env.local
```

Remplir le fichier `.env.local` :
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Daily.co (Vidéo)
DAILY_API_KEY=your_daily_api_key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Application
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. **Initialiser la base de données**
```bash
npm run db:setup
```

5. **Lancer l'application**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
famalink-mvp/
├── app/                          # App Router (Next.js 14)
│   ├── (auth)/                   # Pages d'authentification
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/               # Interface médecin
│   │   ├── patients/            # Gestion patients
│   │   ├── calendar/            # Calendrier RDV
│   │   └── consultations/       # Téléconsultations
│   ├── api/                     # API Routes
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── consultations/
│   │   └── sms/
│   ├── globals.css              # Styles globaux
│   └── layout.tsx               # Layout principal
├── components/                   # Composants React
│   ├── ui/                      # Composants UI (shadcn)
│   ├── patients/
│   │   ├── PatientCard.tsx
│   │   ├── PatientForm.tsx
│   │   └── PatientList.tsx
│   ├── appointments/
│   │   ├── Calendar.tsx
│   │   └── AppointmentForm.tsx
│   ├── consultations/
│   │   ├── VideoCall.tsx
│   │   └── ConsultationNotes.tsx
│   └── common/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Loading.tsx
├── lib/                         # Utilitaires et config
│   ├── supabase.ts             # Client Supabase
│   ├── daily.ts                # Configuration Daily.co
│   ├── twilio.ts               # Configuration Twilio
│   ├── utils.ts                # Fonctions utilitaires
│   └── types.ts                # Types TypeScript
├── public/                      # Assets statiques
│   ├── images/
│   └── icons/
├── sql/                         # Scripts SQL
│   ├── schema.sql              # Schéma de base
│   └── seed.sql                # Données de test
├── docs/                        # Documentation
│   ├── mvp-famalink.md
│   └── api-documentation.md
└── tests/                       # Tests
    ├── components/
    └── api/
```

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/UI** - Composants UI pré-construits
- **React Hook Form** - Gestion des formulaires

### Backend
- **Next.js API Routes** - API intégrée
- **Supabase** - Base de données PostgreSQL managée
- **Supabase Auth** - Authentification

### Services Externes
- **Daily.co** - Vidéoconférence
- **Twilio** - Envoi de SMS
- **Vercel** - Hébergement et déploiement

## 📊 Base de Données

### Schéma Principal
```sql
doctors (médecins)
├── id (UUID)
├── email (VARCHAR)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── phone (VARCHAR)
└── speciality (VARCHAR)

patients (patients)
├── id (UUID)
├── doctor_id (UUID)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── phone (VARCHAR)
├── date_of_birth (DATE)
└── address (TEXT)

appointments (rendez-vous)
├── id (UUID)
├── doctor_id (UUID)
├── patient_id (UUID)
├── appointment_date (TIMESTAMP)
├── status (VARCHAR)
└── notes (TEXT)

consultations (consultations)
├── id (UUID)
├── appointment_id (UUID)
├── symptoms (TEXT)
├── diagnosis (TEXT)
├── prescription (TEXT)
└── duration (INTEGER)
```

## 🧪 Tests

### Lancer les tests
```bash
# Tests unitaires
npm run test

# Tests avec coverage
npm run test:coverage

# Tests e2e
npm run test:e2e
```

### Structure des tests
- **Components** : Tests des composants React
- **API** : Tests des routes API
- **Integration** : Tests d'intégration
- **E2E** : Tests end-to-end avec Playwright

## 🚀 Déploiement

### Environnement de Production

1. **Déploiement sur Vercel**
```bash
npm run build
vercel --prod
```

2. **Configuration des variables d'environnement**
Dans le dashboard Vercel, ajouter toutes les variables du `.env.local`

3. **Configuration de la base de données**
- Base Supabase en mode production
- Sauvegardes automatiques activées

### Monitoring
- **Vercel Analytics** - Performance
- **Supabase Dashboard** - Base de données
- **Daily.co Dashboard** - Téléconsultations

## 📈 Métriques et Monitoring

### KPIs Techniques
- Temps de réponse API < 200ms
- Uptime > 99.5%
- Taux d'erreur < 0.1%

### KPIs Business
- Nombre de consultations/jour
- Temps moyen de consultation
- Satisfaction médecins (NPS)

## 🤝 Contribution

### Guidelines
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

### Standards de code
- ESLint + Prettier pour le formatting
- Types TypeScript obligatoires
- Tests pour les nouvelles fonctionnalités
- Documentation des composants

## 📚 Documentation

- **[Plan MVP Complet](docs/mvp-famalink.md)** - Spécifications détaillées
- **[Documentation API](docs/api-documentation.md)** - Endpoints disponibles
- **[Guide Utilisateur](docs/user-guide.md)** - Mode d'emploi médecins

## 🔒 Sécurité

### Mesures de Protection
- Chiffrement TLS 1.3 en transit
- Données sensibles chiffrées au repos
- Authentification 2FA (optionnelle)
- Audit trail des actions sensibles
- Sessions sécurisées avec timeout

### Conformité
- RGPD compliant
- ISO 27001 (en cours)
- Hébergement France/Europe

## 🆘 Support

### En cas de problème
1. Vérifier la [documentation](docs/)
2. Consulter les [issues GitHub](https://github.com/votre-username/famalink-mvp/issues)
3. Contacter le support : support@famalink.africa

### Canaux de communication
- 📧 Email : dev@famalink.africa
- 💬 Discord : [Serveur FamaLink](https://discord.gg/famalink)
- 📱 WhatsApp : +225 XX XX XX XX

## 📅 Roadmap

### Version 1.1 (Dans 1 mois)
- [ ] Prescription électronique
- [ ] Export PDF consultations
- [ ] Amélioration interface mobile

### Version 1.2 (Dans 3 mois)
- [ ] Intégration Orange Money
- [ ] Multi-médecins (cliniques)
- [ ] Statistiques avancées

### Version 2.0 (Dans 6 mois)
- [ ] IA diagnostic basique
- [ ] Application mobile native
- [ ] Expansion 5 villes Côte d'Ivoire

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Médecins partenaires** pour leurs retours précieux
- **Communauté Next.js** pour les ressources
- **Équipe Supabase** pour la plateforme
- **Daily.co** pour l'API vidéo stable

---

**Développé avec ❤️ pour l'Afrique**

*Pour toute question ou collaboration, n'hésitez pas à nous contacter !*