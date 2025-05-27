# MVP FamaLink - Plan de Développement
## Solution de Télésanté Simplifiée pour l'Afrique

---

## 1. VISION DU MVP

### Objectif Principal
Créer une version minimale viable de FamaLink permettant à un médecin de gérer ses patients et effectuer des téléconsultations basiques.

### Public Cible MVP
- **1-3 médecins généralistes** à Abidjan
- **50-100 patients maximum** par médecin
- **Zones urbaines avec connexion internet stable**

---

## 2. FONCTIONNALITÉS MVP (Core Features)

### 2.1 Gestion des Patients
- [ ] Créer un nouveau patient (nom, téléphone, âge)
- [ ] Afficher la liste des patients
- [ ] Consulter le profil d'un patient
- [ ] Ajouter des notes de consultation
- [ ] Historique simple des consultations

### 2.2 Système de Rendez-vous
- [ ] Calendrier médecin (vue semaine)
- [ ] Créer un rendez-vous
- [ ] Modifier/annuler un rendez-vous
- [ ] Notification SMS automatique (rappel J-1)

### 2.3 Téléconsultation Basique
- [ ] Démarrer une consultation vidéo
- [ ] Chat en temps réel pendant la consultation
- [ ] Terminer la consultation
- [ ] Sauvegarder les notes de consultation

### 2.4 Authentification
- [ ] Connexion médecin (email/mot de passe)
- [ ] Profil médecin basique
- [ ] Déconnexion sécurisée

---

## 3. ARCHITECTURE TECHNIQUE MVP

### 3.1 Stack Technologique

```
Frontend:
- Next.js 14 (React + App Router)
- Tailwind CSS (styling rapide)
- Shadcn/UI (composants pré-faits)

Backend:
- Next.js API Routes (backend intégré)
- Supabase (base de données + auth)

Téléconsultation:
- Daily.co API (vidéo simplifié)

Communications:
- Twilio API (SMS)

Hébergement:
- Vercel (déploiement automatique)
```

### 3.2 Structure du Projet

```
famalink-mvp/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── patients/
│   │   ├── calendar/
│   │   └── consultations/
│   ├── api/
│   │   ├── patients/
│   │   ├── appointments/
│   │   └── consultations/
│   └── globals.css
├── components/
│   ├── ui/ (shadcn components)
│   ├── PatientCard.tsx
│   ├── Calendar.tsx
│   └── VideoCall.tsx
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── types.ts
├── public/
└── package.json
```

---

## 4. SCHÉMA DE BASE DE DONNÉES

### 4.1 Tables Principales

```sql
-- Table des médecins
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  phone VARCHAR,
  speciality VARCHAR DEFAULT 'Généraliste',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id),
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des rendez-vous
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id),
  patient_id UUID REFERENCES patients(id),
  appointment_date TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 30,
  status VARCHAR DEFAULT 'scheduled', -- scheduled, completed, cancelled
  type VARCHAR DEFAULT 'teleconsultation', -- teleconsultation, in-person
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des consultations
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id),
  doctor_id UUID REFERENCES doctors(id),
  patient_id UUID REFERENCES patients(id),
  consultation_date TIMESTAMP DEFAULT NOW(),
  symptoms TEXT,
  diagnosis TEXT,
  prescription TEXT,
  notes TEXT,
  duration INTEGER,
  consultation_type VARCHAR DEFAULT 'video'
);
```

---

## 5. WIREFRAMES ET INTERFACES

### 5.1 Pages Principales

1. **Page de Connexion**
   - Formulaire email/mot de passe
   - Lien "Mot de passe oublié"

2. **Dashboard Principal**
   - Vue d'ensemble : RDV du jour, nombre de patients
   - Menu de navigation : Patients, Calendrier, Consultations

3. **Liste des Patients**
   - Tableau avec nom, téléphone, dernier RDV
   - Bouton "Nouveau Patient"
   - Barre de recherche

4. **Profil Patient**
   - Informations personnelles
   - Historique des consultations
   - Bouton "Nouvelle Consultation"

5. **Calendrier**
   - Vue semaine
   - Créneaux disponibles/occupés
   - Clic pour créer un RDV

6. **Interface de Téléconsultation**
   - Vidéo patient/médecin
   - Chat latéral
   - Zone de prise de notes
   - Boutons contrôle (micro, caméra, raccrocher)

---

## 6. PLANNING DE DÉVELOPPEMENT (8 semaines)

### Semaine 1-2 : Configuration et Base
- [ ] Initialiser le projet Next.js
- [ ] Configurer Supabase (DB + Auth)
- [ ] Créer les tables de base de données
- [ ] Page de connexion/inscription
- [ ] Dashboard de base

### Semaine 3-4 : Gestion des Patients
- [ ] CRUD patients complet
- [ ] Interface liste des patients
- [ ] Profil patient détaillé
- [ ] Formulaire nouveau patient

### Semaine 5-6 : Système de RDV
- [ ] Calendrier interactif
- [ ] Création/modification RDV
- [ ] Intégration SMS (Twilio)
- [ ] Notifications automatiques

### Semaine 7-8 : Téléconsultation
- [ ] Intégration Daily.co
- [ ] Interface de consultation
- [ ] Sauvegarde des notes
- [ ] Tests complets

---

## 7. BUDGET MVP (3 mois)

### 7.1 Coûts Mensuels
```
Supabase (Pro) : 25€/mois
Vercel (Pro) : 20€/mois
Daily.co (Starter) : 50€/mois
Twilio SMS : 30€/mois
Domaine .com : 3€/mois
Total mensuel : 128€
```

### 7.2 Coûts de Développement
```
Temps de développement : 8 semaines × 40h = 320h
Si freelance (50€/h) : 16 000€
Si développement personnel : 0€ (hors coût opportunité)
```

---

## 8. CRITÈRES DE SUCCÈS MVP

### 8.1 Métriques Techniques
- [ ] Application fonctionnelle sans bugs majeurs
- [ ] Temps de chargement < 3 secondes
- [ ] Vidéo de qualité acceptable (720p minimum)
- [ ] SMS de rappel envoyé automatiquement

### 8.2 Métriques Utilisateur
- [ ] 3 médecins testent la solution
- [ ] 30 patients créés minimum
- [ ] 20 téléconsultations réalisées
- [ ] Note de satisfaction > 7/10

### 8.3 Métriques Business
- [ ] Validation du concept par les médecins
- [ ] Feedback positif des patients
- [ ] Temps de consultation réduit de 30%
- [ ] Aucun problème de sécurité

---

## 9. RISQUES ET MITIGATION MVP

### 9.1 Risques Techniques
**Problème de connectivité**
- Mitigation : Mode dégradé (audio seulement)
- Plan B : Report automatique de RDV

**Bugs de vidéoconférence**
- Mitigation : Tests intensifs avec Daily.co
- Plan B : Consultation téléphonique classique

### 9.2 Risques Utilisateur
**Résistance des médecins**
- Mitigation : Formation personnalisée
- Support technique direct

**Patients non équipés smartphone**
- Mitigation : Focus sur zones urbaines pour MVP
- Extension rurale en V2

---

## 10. PLAN DE VALIDATION

### 10.1 Phase de Test (2 semaines)
1. **Alpha Testing** (Semaine 1)
   - Tests internes complets
   - Correction des bugs critiques

2. **Beta Testing** (Semaine 2)
   - Tests avec 2 médecins partenaires
   - 10 patients volontaires
   - Collecte de feedback

### 10.2 Critères de Lancement
- [ ] Zéro bug critique
- [ ] Feedback médecins > 7/10
- [ ] Formation médecins terminée
- [ ] Support client opérationnel

---

## 11. ROADMAP POST-MVP

### Version 1.1 (1 mois après MVP)
- Prescription électronique simple
- Export PDF des consultations
- Amélioration UX mobile

### Version 1.2 (3 mois après MVP)
- Intégration Orange Money
- Multi-médecins (clinique)
- Statistiques basiques

### Version 2.0 (6 mois après MVP)
- IA diagnostic simple
- Application mobile native
- Expansion 5 villes

---

## 12. CONTACTS ET RESSOURCES

### 12.1 Documentation Technique
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Daily.co API](https://docs.daily.co)
- [Twilio SMS API](https://www.twilio.com/docs/sms)

### 12.2 Design et UX
- [Shadcn/UI Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Healthcare UI Patterns](https://healthcare.design)

### 12.3 Conformité et Sécurité
- Guide RGPD simplifié
- Sécurité des données médicales
- Certification HDS (pour plus tard)

---

## 13. CHECKLIST DE DÉMARRAGE

### Avant de Coder
- [ ] Valider le concept avec 3 médecins
- [ ] Créer les comptes (Supabase, Vercel, etc.)
- [ ] Définir le nom de domaine
- [ ] Préparer les mockups de base

### Configuration Initiale
- [ ] Installer Node.js et Git
- [ ] Créer le projet Next.js
- [ ] Configurer Supabase
- [ ] Premier déploiement sur Vercel

### Développement
- [ ] Page de connexion fonctionnelle
- [ ] CRUD patients de base
- [ ] Premier test de vidéoconférence

---

*Document créé le : [Date]*  
*Version : 1.0*  
*Statut : Plan de développement*  
*Révision prévue : Fin de chaque sprint*