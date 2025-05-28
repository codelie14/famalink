// Types principaux de l'application

export interface Doctor {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  speciality: string
  created_at: string
}

export interface Patient {
  id: string
  doctor_id: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth?: string
  gender?: 'M' | 'F' | 'Autre'
  address?: string
  created_at: string
  doctor?: Doctor
}

export interface Appointment {
  id: string
  doctor_id: string
  patient_id: string
  appointment_date: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  type: 'teleconsultation' | 'in-person'
  notes?: string
  created_at: string
  patient?: Patient
  doctor?: Doctor
}

export interface Consultation {
  id: string
  appointment_id: string
  doctor_id: string
  patient_id: string
  consultation_date: string
  symptoms?: string
  diagnosis?: string
  prescription?: string
  notes?: string
  duration?: number
  consultation_type: 'video' | 'audio' | 'chat'
  created_at: string
  appointment?: Appointment
  patient?: Patient
}

// Types pour les formulaires
export interface CreatePatientForm {
  first_name: string
  last_name: string
  phone: string
  date_of_birth?: string
  gender?: 'M' | 'F' | 'Autre'
  address?: string
}

export interface CreateAppointmentForm {
  patient_id: string
  appointment_date: string
  duration: number
  type: 'teleconsultation' | 'in-person'
  notes?: string
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Types pour Daily.co
export interface DailyCallObject {
  join: () => Promise<void>
  leave: () => Promise<void>
  participants: () => Record<string, any>
  localAudio: () => boolean
  localVideo: () => boolean
  setLocalAudio: (enabled: boolean) => void
  setLocalVideo: (enabled: boolean) => void
}