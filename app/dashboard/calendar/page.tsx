"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Video, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/providers/auth-provider"

// Types pour les rendez-vous
type AppointmentType = {
  id: string;
  patient_id: string;
  patient_name?: string;
  appointment_date: string;
  type: "teleconsultation" | "in-person";
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
}

export default function CalendarPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week">("week")
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  
  // Heures de la journée (8h à 18h)
  const hours = Array.from({ length: 11 }, (_, i) => i + 8)
  
  // Jours de la semaine actuelle
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Charger les rendez-vous
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true)
      
      try {
        if (!user) {
          router.push('/login')
          return
        }
        
        // Récupérer les rendez-vous du médecin pour la semaine en cours
        const { data: appointmentsData, error } = await supabase
          .from('appointments')
          .select('id, patient_id, appointment_date, duration, type, status')
          .eq('doctor_id', user.id)
          .gte('appointment_date', weekStart.toISOString())
          .lte('appointment_date', weekEnd.toISOString())
          .order('appointment_date', { ascending: true })
        
        if (error) throw error
        
        // Récupérer les informations des patients pour chaque rendez-vous
        const appointmentsWithPatientInfo = await Promise.all((appointmentsData || []).map(async (apt) => {
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .select('first_name, last_name')
            .eq('id', apt.patient_id)
            .single()
          
          if (patientError) {
            console.error("Erreur lors de la récupération du patient:", patientError)
            return {
              ...apt,
              patient_name: "Patient inconnu"
            }
          }
          
          return {
            ...apt,
            patient_name: `${patientData.first_name} ${patientData.last_name}`
          }
        }))
        
        setAppointments(appointmentsWithPatientInfo)
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les rendez-vous",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchAppointments()
  }, [selectedDate, toast, user, router, weekStart, weekEnd])

  // Naviguer à la semaine précédente
  const goToPreviousWeek = () => {
    setSelectedDate(addDays(selectedDate, -7))
  }

  // Naviguer à la semaine suivante
  const goToNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7))
  }

  // Obtenir les rendez-vous pour un jour et une heure spécifiques
  const getAppointmentsForTimeSlot = (day: Date, hour: number) => {
    return appointments.filter(apt => {
      const aptDate = format(parseISO(apt.appointment_date), "yyyy-MM-dd")
      const dayDate = format(day, "yyyy-MM-dd")
      const aptHour = parseInt(apt.appointment_date.split(":")[0])
      
      return aptDate === dayDate && aptHour === hour
    })
  }

  // Ouvrir les détails d'un rendez-vous
  const openAppointmentDetails = (appointmentId: string) => {
    router.push(`/dashboard/calendar/${appointmentId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendrier</h1>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, "MMMM yyyy", { locale: fr })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-1">
            <Button 
              variant={view === "day" ? "default" : "outline"} 
              size="sm"
              onClick={() => setView("day")}
            >
              Jour
            </Button>
            <Button 
              variant={view === "week" ? "default" : "outline"} 
              size="sm"
              onClick={() => setView("week")}
            >
              Semaine
            </Button>
          </div>
          
          <Link href="/dashboard/calendar/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau rendez-vous
            </Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-[500px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-famalink-blue-700"></div>
          </div>
        ) : view === "week" ? (
          <div className="grid grid-cols-8 divide-x divide-gray-200">
            {/* Colonne des heures */}
            <div className="col-span-1 bg-gray-50 p-4">
              <div className="h-12"></div>
              {hours.map((hour) => (
                <div key={hour} className="h-24 py-2 text-sm text-gray-500">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Colonnes des jours */}
            {weekDays.map((day, index) => (
              <div key={index} className="col-span-1">
                <div 
                  className={cn(
                    "p-4 text-center font-medium sticky top-0 bg-gray-50 z-10",
                    isSameDay(day, new Date()) && "bg-famalink-blue-50 text-famalink-blue-700"
                  )}
                >
                  <div>{format(day, "EEE", { locale: fr })}</div>
                  <div className="text-lg">{format(day, "d", { locale: fr })}</div>
                </div>
                <div className="divide-y divide-gray-200">
                  {hours.map((hour) => {
                    const timeSlotAppointments = getAppointmentsForTimeSlot(day, hour)
                    
                    return (
                      <div key={hour} className="relative h-24 group">
                        {/* Ligne de l'heure */}
                        <div className="absolute inset-0 border-t border-gray-100"></div>
                        
                        {/* Rendez-vous */}
                        {timeSlotAppointments.length > 0 ? (
                          timeSlotAppointments.map((appointment) => (
                            <div 
                              key={appointment.id}
                              className={cn(
                                "absolute inset-x-1 rounded p-2 cursor-pointer transition-all hover:shadow-md",
                                appointment.type === "teleconsultation" 
                                  ? "bg-famalink-blue-100" 
                                  : "bg-green-100"
                              )}
                              style={{
                                top: "4px",
                                height: `${(appointment.duration / 60) * 96}px`,
                              }}
                              onClick={() => openAppointmentDetails(appointment.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {appointment.type === "teleconsultation" ? (
                                    <Video className="h-4 w-4 text-famalink-blue-700" />
                                  ) : (
                                    <User className="h-4 w-4 text-green-700" />
                                  )}
                                  <span className="text-sm font-medium truncate">
                                    {appointment.patient_name}
                                  </span>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      openAppointmentDetails(appointment.id)
                                    }}>
                                      Voir les détails
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      router.push(`/dashboard/consultations/${appointment.id}`)
                                    }}>
                                      Démarrer la consultation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toast({
                                          title: "Rendez-vous annulé",
                                          description: "Le rendez-vous a été annulé avec succès."
                                        })
                                      }}
                                    >
                                      Annuler
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <p className="text-xs mt-1">
                                {format(parseISO(appointment.appointment_date), "HH:mm", { locale: fr })}
                                <span className="mx-1">•</span>
                                {appointment.duration} min
                              </p>
                            </div>
                          ))
                        ) : (
                          <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 cursor-pointer"
                            onClick={() => {
                              const newDate = new Date(day)
                              newDate.setHours(hour, 0, 0, 0)
                              router.push(`/dashboard/calendar/new?date=${format(newDate, "yyyy-MM-dd")}&time=${hour}:00`)
                            }}
                          >
                            <div className="h-full w-full flex items-center justify-center">
                              <div className="rounded-full bg-gray-100 p-1">
                                <Plus className="h-4 w-4 text-gray-500" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-gray-200">
            <div className="p-4 text-center font-medium sticky top-0 bg-gray-50 z-10">
              <div className="text-lg">{format(selectedDate, "EEEE d MMMM", { locale: fr })}</div>
            </div>
            
            {hours.map((hour) => {
              const timeSlotAppointments = getAppointmentsForTimeSlot(selectedDate, hour)
              
              return (
                <div key={hour} className="relative h-24 group p-4 flex">
                  <div className="w-20 text-sm text-gray-500">
                    {hour}:00
                  </div>
                  
                  <div className="flex-1 relative">
                    {timeSlotAppointments.length > 0 ? (
                      timeSlotAppointments.map((appointment) => (
                        <div 
                          key={appointment.id}
                          className={cn(
                            "absolute inset-y-0 left-0 right-12 rounded p-2 cursor-pointer transition-all hover:shadow-md",
                            appointment.type === "teleconsultation" 
                              ? "bg-famalink-blue-100" 
                              : "bg-green-100"
                          )}
                          onClick={() => openAppointmentDetails(appointment.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {appointment.type === "teleconsultation" ? (
                                <Video className="h-4 w-4 text-famalink-blue-700" />
                              ) : (
                                <User className="h-4 w-4 text-green-700" />
                              )}
                              <span className="text-sm font-medium">
                                {appointment.patient_name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs">
                                {format(parseISO(appointment.appointment_date), "HH:mm", { locale: fr })}
                                <span className="mx-1">•</span>
                                {appointment.duration} min
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/dashboard/consultations/${appointment.id}`)
                                }}
                              >
                                Démarrer
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 cursor-pointer"
                        onClick={() => {
                          const newDate = new Date(selectedDate)
                          newDate.setHours(hour, 0, 0, 0)
                          router.push(`/dashboard/calendar/new?date=${format(newDate, "yyyy-MM-dd")}&time=${hour}:00`)
                        }}
                      >
                        <div className="h-full w-full flex items-center justify-center">
                          <div className="rounded-full bg-gray-100 p-1">
                            <Plus className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}