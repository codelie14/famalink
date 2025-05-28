import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Ces valeurs seront remplacées par les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Création du client Supabase avec les types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Types pour les tables principales
export type Doctor = Database['public']['Tables']['doctors']['Row'];
export type Patient = Database['public']['Tables']['patients']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Consultation = Database['public']['Tables']['consultations']['Row'];

// Types pour les insertions
export type DoctorInsert = Database['public']['Tables']['doctors']['Insert'];
export type PatientInsert = Database['public']['Tables']['patients']['Insert'];
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
export type ConsultationInsert = Database['public']['Tables']['consultations']['Insert'];

// Types pour les mises à jour
export type DoctorUpdate = Database['public']['Tables']['doctors']['Update'];
export type PatientUpdate = Database['public']['Tables']['patients']['Update'];
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];
export type ConsultationUpdate = Database['public']['Tables']['consultations']['Update'];