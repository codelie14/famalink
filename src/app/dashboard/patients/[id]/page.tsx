'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Patient, Consultation, Appointment } from '@/types'
import Link from 'next/link'

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'consultations' | 'appointments'>('info')

  useEffect(() => {
    async function fetchPatientData() {
      try {
        setLoading(true)
        
        // Fetch patient details
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', params.id)
          .single()
        
        if (patientError) throw patientError
        setPatient(patientData)
        
        // Fetch consultations
        const { data: consultationsData, error: consultationsError } = await supabase
          .from('consultations')
          .select('*')
          .eq('patient_id', params.id)
          .order('consultation_date', { ascending: false })
        
        if (consultationsError) throw consultationsError
        setConsultations(consultationsData || [])
        
        // Fetch appointments
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', params.id)
          .order('appointment_date', { ascending: false })
        
        if (appointmentsError) throw appointmentsError
        setAppointments(appointmentsData || [])
        
      } catch (error) {
        console.error('Erreur lors du chargement des données du patient:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [params.id])

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Chargement...</div>
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Patient non trouvé</p>
        <Link href="/dashboard/patients" className="text-blue-600 hover:underline mt-4 inline-block">
          Retour à la liste des patients
        </Link>
      </div>
    )
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Non renseigné'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {patient.first_name} {patient.last_name}
        </h1>
        <div>
          <button
            onClick={() => router.push(`/dashboard/patients/${patient.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
          >
            Modifier
          </button>
          <button
            onClick={() => router.push(`/dashboard/appointments/new?patientId=${patient.id}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Nouveau Rendez-vous
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'info'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'consultations'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Consultations ({consultations.length})
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'appointments'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rendez-vous ({appointments.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500">Nom complet:</span>
                    <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Téléphone:</span>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date de naissance:</span>
                    <p className="font-medium">{formatDate(patient.date_of_birth)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Genre:</span>
                    <p className="font-medium">
                      {patient.gender === 'M' ? 'Homme' : patient.gender === 'F' ? 'Femme' : patient.gender || 'Non renseigné'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Adresse:</span>
                    <p className="font-medium">{patient.address || 'Non renseignée'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Résumé</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500">Patient depuis:</span>
                    <p className="font-medium">{formatDate(patient.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Nombre de consultations:</span>
                    <p className="font-medium">{consultations.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Prochain rendez-vous:</span>
                    <p className="font-medium">
                      {appointments.filter(a => new Date(a.appointment_date) > new Date() && a.status === 'scheduled').length > 0
                        ? formatDate(appointments.filter(a => new Date(a.appointment_date) > new Date() && a.status === 'scheduled')[0].appointment_date)
                        : 'Aucun rendez-vous prévu'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Historique des consultations</h3>
                <button
                  onClick={() => router.push(`/dashboard/consultations/new?patientId=${patient.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md"
                >
                  Nouvelle consultation
                </button>
              </div>

              {consultations.length === 0 ? (
                <p className="text-gray-500">Aucune consultation enregistrée</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnostic</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {consultations.map((consultation) => (
                        <tr key={consultation.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(consultation.consultation_date)}</td>
                          <td className="px-4 py-3 whitespace-nowrap capitalize">{consultation.consultation_type}</td>
                          <td className="px-4 py-3">{consultation.diagnosis?.substring(0, 50) || 'Non renseigné'}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => router.push(`/dashboard/consultations/${consultation.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Voir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Rendez-vous</h3>
                <button
                  onClick={() => router.push(`/dashboard/appointments/new?patientId=${patient.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded-md"
                >
                  Nouveau rendez-vous
                </button>
              </div>

              {appointments.length === 0 ? (
                <p className="text-gray-500">Aucun rendez-vous enregistré</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{formatDate(appointment.appointment_date)}</td>
                          <td className="px-4 py-3 whitespace-nowrap capitalize">{appointment.type}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                appointment.status === 'scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : appointment.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {appointment.status === 'scheduled'
                                ? 'Planifié'
                                : appointment.status === 'completed'
                                ? 'Terminé'
                                : appointment.status === 'cancelled'
                                ? 'Annulé'
                                : 'Non présenté'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              Voir
                            </button>
                            {appointment.status === 'scheduled' && new Date(appointment.appointment_date) > new Date() && (
                              <button
                                onClick={() => router.push(`/dashboard/consultations/new?appointmentId=${appointment.id}`)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Démarrer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 