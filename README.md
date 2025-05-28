# FamaLink - Solution de Télésanté Simplifiée

FamaLink est une plateforme SaaS de télésanté conçue pour simplifier les consultations médicales à distance, particulièrement adaptée au contexte africain.

## Fonctionnalités

- **Gestion des patients** : Ajout, modification et suivi des dossiers patients
- **Rendez-vous** : Planification et gestion des rendez-vous
- **Téléconsultations** : Consultations vidéo et chat en temps réel
- **Suivi médical** : Historique des consultations et prescriptions
- **Interface responsive** : Accessible sur ordinateur, tablette et mobile

## Technologies utilisées

- **Frontend** : Next.js, React, Tailwind CSS, shadcn/ui
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL (via Supabase)
- **Authentification** : Supabase Auth
- **Stockage** : Supabase Storage

## Prérequis

- Node.js 18+ et npm/yarn
- Compte Supabase (gratuit pour commencer)

## Installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-username/famalink.git
   cd famalink
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou
   yarn
   ```

3. Créez un projet sur [Supabase](https://supabase.com) et récupérez vos clés API

4. Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :
   ```
   NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-supabase
   SUPABASE_SERVICE_ROLE_KEY=votre-clé-service-role-supabase
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. Initialisez votre base de données en exécutant le script SQL dans l'éditeur SQL de Supabase :
   - Copiez le contenu du fichier `lib/schema.sql`
   - Collez-le dans l'éditeur SQL de Supabase et exécutez-le

6. Lancez le serveur de développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

7. Accédez à l'application sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
/
├── app/                    # Routes Next.js App Router
│   ├── (auth)/             # Routes d'authentification
│   ├── dashboard/          # Routes du tableau de bord
│   ├── api/                # API Routes
│   ├── page.tsx            # Page d'accueil
│   └── layout.tsx          # Layout principal
├── components/             # Composants React réutilisables
│   ├── dashboard/          # Composants spécifiques au tableau de bord
│   ├── ui/                 # Composants UI génériques
│   └── providers/          # Providers React Context
├── lib/                    # Utilitaires et configuration
│   ├── supabase.ts         # Client Supabase
│   ├── database.types.ts   # Types TypeScript pour la base de données
│   └── schema.sql          # Script SQL pour initialiser la base de données
└── public/                 # Fichiers statiques
```

## Déploiement

Pour déployer l'application en production, nous recommandons Vercel :

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre dépôt GitHub
3. Configurez les variables d'environnement
4. Déployez !

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

Ce projet est sous licence MIT.