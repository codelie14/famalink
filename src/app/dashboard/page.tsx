'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Appointment, Patient } from '@/types'
import Link from 'next/link'
import { format, isToday, parseISO, startOfDay, endOfDay } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DashboardPage() {
  const router = useRouter()
  const [todayAppointments, setTodayAppointments] = useState<(Appointment & { patient: Patient })[]>([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        
        // Get the current user (doctor)
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
        
        const doctorId = doctorData.id
        
        // Get today's date range
        const today = new Date()
        const startOfToday = startOfDay(today).toISOString()
        const endOfToday = endOfDay(today).toISOString()
        
        // Fetch today's appointments
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:patients(id, first_name, last_name, phone)
          `)
          .eq('doctor_id', doctorId)
          .gte('appointment_date', startOfToday)
          .lte('appointment_date', endOfToday)
          .order('appointment_date', { ascending: true })
        
        if (appointmentsError) throw appointmentsError
        setTodayAppointments(appointments || [])
        
        // Fetch stats
        const { count: totalPatients } = await supabase
          .from('patients')
          .select('id', { count: 'exact', head: true })
          .eq('doctor_id', doctorId)
        
        const { count: totalAppointments } = await supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('doctor_id', doctorId)
        
        const { count: completedAppointments } = await supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('doctor_id', doctorId)
          .eq('status', 'completed')
        
        const { count: upcomingAppointments } = await supabase
          .from('appointments')
          .select('id', { count: 'exact', head: true })
          .eq('doctor_id', doctorId)
          .eq('status', 'scheduled')
          .gt('appointment_date', today.toISOString())
        
        setStats({
          totalPatients: totalPatients || 0,
          totalAppointments: totalAppointments || 0,
          completedAppointments: completedAppointments || 0,
          upcomingAppointments: upcomingAppointments || 0,
        })
        
      } catch (error: any) {
        console.error('Erreur lors du chargement des données du tableau de bord:', error)
        setError(error.message || 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatAppointmentTime = (dateString: string) => {
    return format(parseISO(dateString), 'HH:mm', { locale: fr })
  }

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'scheduled': return 'badge-blue';
      case 'completed': return 'badge-green';
      case 'cancelled': return 'badge-red';
      default: return 'badge-yellow';
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'scheduled': return 'Planifié';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return 'Non présenté';
    }
  }

  return (
    <div className="container page-container">
      <h1 className="page-title">Tableau de bord</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stats-card">
          <h3 className="stats-label">Patients</h3>
          <p className="stats-value">{stats.totalPatients}</p>
          <Link href="/dashboard/patients" className="link mt-2 inline-block">
            Voir tous les patients
          </Link>
        </div>
        
        <div className="stats-card">
          <h3 className="stats-label">Total RDV</h3>
          <p className="stats-value">{stats.totalAppointments}</p>
          <Link href="/dashboard/calendar" className="link mt-2 inline-block">
            Voir le calendrier
          </Link>
        </div>
        
        <div className="stats-card">
          <h3 className="stats-label">RDV Complétés</h3>
          <p className="stats-value">{stats.completedAppointments}</p>
        </div>
        
        <div className="stats-card">
          <h3 className="stats-label">RDV à venir</h3>
          <p className="stats-value">{stats.upcomingAppointments}</p>
        </div>
      </div>
      
      {/* Today's Appointments */}
      <div className="table-container">
        <div className="table-header">
          <h2 className="section-title m-0">Rendez-vous d'aujourd'hui</h2>
          <Link 
            href="/dashboard/appointments/new" 
            className="btn-primary btn-sm"
          >
            Nouveau RDV
          </Link>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-3 text-gray-500">Chargement...</p>
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="text-center py-10">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-gray-500">Aucun rendez-vous prévu aujourd'hui</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead className="table-head">
                  <tr>
                    <th className="table-head-cell">Heure</th>
                    <th className="table-head-cell">Patient</th>
                    <th className="table-head-cell">Type</th>
                    <th className="table-head-cell">Statut</th>
                    <th className="table-head-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {todayAppointments.map((appointment) => (
                    <tr key={appointment.id} className="table-row">
                      <td className="table-cell font-medium text-blue-600">
                        {formatAppointmentTime(appointment.appointment_date)}
                      </td>
                      <td className="table-cell">
                        <div className="font-medium">{appointment.patient.first_name} {appointment.patient.last_name}</div>
                        <div className="text-sm text-gray-500">{appointment.patient.phone}</div>
                      </td>
                      <td className="table-cell capitalize">
                        {appointment.type === 'teleconsultation' ? (
                          <span className="inline-flex items-center">
                            <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Téléconsultation
                          </span>
                        ) : (
                          <span className="inline-flex items-center">
                            <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            En personne
                          </span>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                          {getStatusText(appointment.status)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => router.push(`/dashboard/appointments/${appointment.id}`)}
                          className="btn btn-secondary btn-sm mr-2"
                        >
                          Voir
                        </button>
                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => router.push(`/dashboard/consultations/new?appointmentId=${appointment.id}`)}
                            className="btn btn-success btn-sm"
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
      </div>
      
      {/* Quick Actions */}
      <div className="dashboard-actions">
        <Link 
          href="/dashboard/patients/new"
          className="action-card group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Nouveau Patient</h3>
            <span className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </div>
          <p className="text-gray-500">Enregistrer un nouveau patient</p>
        </Link>
        
        <Link 
          href="/dashboard/appointments/new"
          className="action-card group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Nouveau Rendez-vous</h3>
            <span className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <p className="text-gray-500">Planifier un rendez-vous</p>
        </Link>
        
        <Link 
          href="/dashboard/calendar"
          className="action-card group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Calendrier</h3>
            <span className="bg-blue-100 text-blue-600 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </span>
          </div>
          <p className="text-gray-500">Voir votre planning</p>
        </Link>
      </div>
    </div>
  )
} 