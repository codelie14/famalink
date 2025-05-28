'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CreateAppointmentForm, Patient } from '@/types'
import { format, addMinutes, parseISO } from 'date-fns'

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientIdParam = searchParams.get('patientId')
  const dateParam = searchParams.get('date')
  
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientSearch, setShowPatientSearch] = useState(!patientIdParam)
  
  const [formData, setFormData] = useState<CreateAppointmentForm>({
    patient_id: patientIdParam || '',
    appointment_date: dateParam ? format(parseISO(dateParam), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duration: 30,
    type: 'teleconsultation',
    notes: ''
  })
  const [error, setError] = useState<string | null>(null)

  // Fetch patients for search
  useEffect(() => {
    async function fetchPatients() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          throw new Error('Vous devez être connecté')
        }
        
        // Get the doctor profile
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('id')
          .eq('email', user.email)
          .single()
          
        if (doctorError || !doctorData) {
          throw new Error('Profil médecin non trouvé')
        }
        
        // Fetch all patients for this doctor
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('doctor_id', doctorData.id)
          .order('last_name', { ascending: true })
        
        if (error) throw error
        setPatients(data || [])
        
        // If patientId is provided, fetch and set the selected patient
        if (patientIdParam) {
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientIdParam)
            .single()
            
          if (patientError) throw patientError
          setSelectedPatient(patientData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des patients:', error)
      }
    }

    fetchPatients()
  }, [patientIdParam])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient)
    setFormData(prev => ({ ...prev, patient_id: patient.id }))
    setShowPatientSearch(false)
  }

  const filteredPatients = patients.filter(patient => 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.patient_id || !formData.appointment_date) {
      setError('Veuillez sélectionner un patient et une date de rendez-vous')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // Get the current user (doctor)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Vous devez être connecté pour ajouter un rendez-vous')
      }
      
      // Get the doctor profile
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('id')
        .eq('email', user.email)
        .single()
        
      if (doctorError || !doctorData) {
        throw new Error('Profil médecin non trouvé')
      }
      
      // Calculate end time based on duration
      const appointmentDate = new Date(formData.appointment_date)
      const endTime = addMinutes(appointmentDate, formData.duration)
      
      // Check for overlapping appointments
      const { data: overlappingAppointments, error: overlapError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorData.id)
        .eq('status', 'scheduled')
        .lt('appointment_date', endTime.toISOString())
        .gt('appointment_date', formData.appointment_date)
        
      if (overlapError) throw overlapError
      
      if (overlappingAppointments && overlappingAppointments.length > 0) {
        throw new Error('Il existe déjà un rendez-vous sur ce créneau horaire')
      }
      
      // Create the appointment
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          doctor_id: doctorData.id,
          patient_id: formData.patient_id,
          appointment_date: formData.appointment_date,
          duration: formData.duration,
          type: formData.type,
          notes: formData.notes || null,
          status: 'scheduled'
        })
        
      if (insertError) throw insertError
      
      // Redirect to calendar
      router.push('/dashboard/calendar')
      router.refresh()
      
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout du rendez-vous:', err)
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nouveau Rendez-vous</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {showPatientSearch ? (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Rechercher un patient *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nom, prénom ou téléphone..."
                className="w-full p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              {searchTerm && filteredPatients.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {searchTerm && filteredPatients.length === 0 && (
              <div className="mt-2 text-sm text-gray-500">
                Aucun patient trouvé. 
                <button
                  type="button"
                  className="text-blue-600 hover:underline ml-1"
                  onClick={() => router.push('/dashboard/patients/new')}
                >
                  Créer un nouveau patient
                </button>
              </div>
            )}
          </div>
        ) : selectedPatient ? (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Patient</label>
            <div className="flex justify-between items-center p-3 border border-gray-300 rounded-md">
              <div>
                <div className="font-medium">{selectedPatient.first_name} {selectedPatient.last_name}</div>
                <div className="text-sm text-gray-500">{selectedPatient.phone}</div>
              </div>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setShowPatientSearch(true)
                  setSelectedPatient(null)
                  setFormData(prev => ({ ...prev, patient_id: '' }))
                }}
              >
                Changer
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Patient *</label>
            <button
              type="button"
              className="w-full p-2 border border-dashed border-gray-300 rounded-md text-center hover:bg-gray-50"
              onClick={() => setShowPatientSearch(true)}
            >
              Sélectionner un patient
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Date et heure *</label>
            <input
              type="datetime-local"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Durée (minutes) *</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Type de rendez-vous *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="teleconsultation">Téléconsultation</option>
            <option value="in-person">Consultation en personne</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Notes</label>
          <textarea
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || !formData.patient_id}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
              !formData.patient_id ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
} 