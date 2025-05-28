-- Création des tables pour FamaLink

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des médecins (liée aux utilisateurs Supabase Auth)
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  speciality TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des patients
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des rendez-vous
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- en minutes
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  type TEXT NOT NULL CHECK (type IN ('teleconsultation', 'in-person')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table des consultations
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  consultation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  symptoms TEXT,
  diagnosis TEXT,
  prescription TEXT,
  notes TEXT,
  duration INTEGER, -- en minutes
  consultation_type TEXT NOT NULL CHECK (consultation_type IN ('video', 'chat', 'in-person'))
);

-- Création des politiques de sécurité Row Level Security (RLS)

-- Activer RLS sur toutes les tables
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Politiques pour la table doctors
CREATE POLICY "Les médecins peuvent voir leur propre profil" 
  ON doctors FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Les médecins peuvent mettre à jour leur propre profil" 
  ON doctors FOR UPDATE 
  USING (auth.uid() = id);

-- Politiques pour la table patients
CREATE POLICY "Les médecins peuvent voir leurs propres patients" 
  ON patients FOR SELECT 
  USING (auth.uid() = doctor_id);

CREATE POLICY "Les médecins peuvent ajouter des patients" 
  ON patients FOR INSERT 
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Les médecins peuvent mettre à jour leurs propres patients" 
  ON patients FOR UPDATE 
  USING (auth.uid() = doctor_id);

CREATE POLICY "Les médecins peuvent supprimer leurs propres patients" 
  ON patients FOR DELETE 
  USING (auth.uid() = doctor_id);

-- Politiques pour la table appointments
CREATE POLICY "Les médecins peuvent voir leurs propres rendez-vous" 
  ON appointments FOR SELECT 
  USING (auth.uid() = doctor_id);

CREATE POLICY "Les médecins peuvent ajouter des rendez-vous" 
  ON appointments FOR INSERT 
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Les médecins peuvent mettre à jour leurs propres rendez-vous" 
  ON appointments FOR UPDATE 
  USING (auth.uid() = doctor_id);

CREATE POLICY "Les médecins peuvent supprimer leurs propres rendez-vous" 
  ON appointments FOR DELETE 
  USING (auth.uid() = doctor_id);

-- Politiques pour la table consultations
CREATE POLICY "Les médecins peuvent voir leurs propres consultations" 
  ON consultations FOR SELECT 
  USING (auth.uid() = doctor_id);

CREATE POLICY "Les médecins peuvent ajouter des consultations" 
  ON consultations FOR INSERT 
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Les médecins peuvent mettre à jour leurs propres consultations" 
  ON consultations FOR UPDATE 
  USING (auth.uid() = doctor_id);

CREATE POLICY "Les médecins peuvent supprimer leurs propres consultations" 
  ON consultations FOR DELETE 
  USING (auth.uid() = doctor_id);

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_patients_doctor_id ON patients(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_appointment_id ON consultations(appointment_id); 