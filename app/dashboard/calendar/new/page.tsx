"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar as CalendarIcon, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("09:00")
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [type, setType] = useState<"teleconsultation" | "in-person">("teleconsultation")
  const [duration, setDuration] = useState<string>("30")
  const [notes, setNotes] = useState<string>("")

  // Récupérer les paramètres d'URL (si présents)
  useEffect(() => {
    const patientId = searchParams.get('patientId')
    const dateParam = searchParams.get('date')
    const timeParam = searchParams.get('time')
    
    if (patientId) setSelectedPatient(patientId)
    if (dateParam) setDate(new Date(dateParam))
    if (timeParam) setTime(timeParam)
  }, [searchParams])

  // Charger les patients depuis Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Récupérer l'utilisateur actuel
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }
        
        // Récupérer les patients du médecin
        const { data, error } = await supabase
          .from('patients')
          .select('id, first_name, last_name')
          .eq('doctor_id', user.id)
          .order('last_name', { ascending: true })
        
        if (error) throw error
        
        // Formater les données des patients
        const formattedPatients = (data || []).map(patient => ({
          id: patient.id,
          name: `${patient.first_name} ${patient.last_name}`
        }))
        
        setPatients(formattedPatients)
      } catch (error) {
        console.error("Erreur lors du chargement des patients:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des patients",
          variant: "destructive"
        })
      }
    }

    fetchPatients()
  }, [router, toast])

  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minute = i % 2 === 0 ? "00" : "30"
    return `${hour.toString().padStart(2, "0")}:${minute}`
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date || !time || !selectedPatient) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      // Créer la date du rendez-vous
      const appointmentDate = new Date(date)
      const [hours, minutes] = time.split(':').map(Number)
      appointmentDate.setHours(hours, minutes)

      // Ajouter le rendez-vous dans la base de données
      const { data, error } = await supabase.from('appointments').insert({
        doctor_id: user.id,
        patient_id: selectedPatient,
        appointment_date: appointmentDate.toISOString(),
        duration: parseInt(duration),
        status: 'scheduled',
        type: type,
        notes: notes || null
      })

      if (error) throw error

      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été ajouté avec succès."
      })

      // Rediriger vers la page du calendrier
      router.push("/dashboard/calendar")
    } catch (error: any) {
      console.error("Erreur lors de la création du rendez-vous:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du rendez-vous.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nouveau rendez-vous</h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informations du rendez-vous</CardTitle>
            <CardDescription>
              Planifiez un nouveau rendez-vous avec un patient
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger id="patient" className="w-full">
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Heure</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time" className="w-full">
                    <SelectValue placeholder="Sélectionner une heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de rendez-vous</Label>
                <Select 
                  value={type} 
                  onValueChange={(value) => setType(value as "teleconsultation" | "in-person")}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teleconsultation">Téléconsultation</SelectItem>
                    <SelectItem value="in-person">En personne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration" className="w-full">
                    <SelectValue placeholder="Sélectionner une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Ajouter des notes pour ce rendez-vous..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer le rendez-vous"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
} 