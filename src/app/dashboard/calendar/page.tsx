'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Appointment, Patient } from '@/types'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function CalendarPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<(Appointment & { patient: Patient })[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate start and end of week
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 }) // Sunday
  
  // Generate array of days for the current week
  const daysOfWeek = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: endOfCurrentWeek
  })

  // Time slots from 8:00 to 18:00, every 30 minutes
  const timeSlots = Array.from({ length: 20 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minute = i % 2 === 0 ? '00' : '30'
    return `${hour}:${minute}`
  })

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true)
        
        // Format dates for Supabase query
        const startDate = startOfCurrentWeek.toISOString()
        const endDate = endOfCurrentWeek.toISOString()
        
        // Fetch appointments with patient data
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:patients(id, first_name, last_name, phone)
          `)
          .gte('appointment_date', startDate)
          .lte('appointment_date', endDate)
          .order('appointment_date', { ascending: true })
        
        if (error) throw error
        
        setAppointments(data || [])
      } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [currentDate])

  // Get appointments for a specific day and time
  const getAppointmentsForSlot = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number)
    
    return appointments.filter(appointment => {
      const appointmentDate = parseISO(appointment.appointment_date)
      return (
        isSameDay(appointmentDate, day) &&
        appointmentDate.getHours() === hours &&
        appointmentDate.getMinutes() === minutes
      )
    })
  }

  // Navigate to previous/next week
  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  // Format date to display in header
  const formatDayHeader = (date: Date) => {
    return format(date, 'EEE d', { locale: fr })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendrier</h1>
        <div>
          <button
            onClick={() => router.push('/dashboard/appointments/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Nouveau Rendez-vous
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-medium">
            {format(startOfCurrentWeek, 'd MMMM', { locale: fr })} - {format(endOfCurrentWeek, 'd MMMM yyyy', { locale: fr })}
          </h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"
          >
            &lt; Précédente
          </button>
          <button
            onClick={goToToday}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"
          >
            Aujourd'hui
          </button>
          <button
            onClick={goToNextWeek}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"
          >
            Suivante &gt;
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Heure
                  </th>
                  {daysOfWeek.map((day) => (
                    <th 
                      key={day.toString()} 
                      className={`px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                      }`}
                    >
                      {formatDayHeader(day)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot} className="hover:bg-gray-50">
                    <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500">
                      {timeSlot}
                    </td>
                    {daysOfWeek.map((day) => {
                      const slotsAppointments = getAppointmentsForSlot(day, timeSlot)
                      return (
                        <td 
                          key={day.toString()} 
                          className={`px-1 py-2 h-16 align-top border-r border-gray-100 ${
                            isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            const date = new Date(day)
                            const [hours, minutes] = timeSlot.split(':').map(Number)
                            date.setHours(hours, minutes)
                            router.push(`/dashboard/appointments/new?date=${date.toISOString()}`)
                          }}
                        >
                          {slotsAppointments.length > 0 ? (
                            <div className="space-y-1">
                              {slotsAppointments.map((appointment) => (
                                <div 
                                  key={appointment.id}
                                  className={`p-1 rounded text-xs cursor-pointer ${
                                    appointment.status === 'scheduled' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : appointment.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/dashboard/appointments/${appointment.id}`)
                                  }}
                                >
                                  <div className="font-medium">{appointment.patient.first_name} {appointment.patient.last_name}</div>
                                  <div>{appointment.type}</div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
} 