"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Search, UserRound, MoreHorizontal, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { supabase } from "@/lib/supabase"
import { Patient } from "@/lib/supabase"

// Type pour les patients avec des champs supplémentaires
type PatientWithMeta = Patient & {
  lastVisit?: string;
  consultationsCount?: number;
  fullName?: string;
}

export default function PatientsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<string>("name")
  const [isLoading, setIsLoading] = useState(true)
  const [patients, setPatients] = useState<PatientWithMeta[]>([])
  
  // Charger les patients
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true)
      
      try {
        // Récupérer l'utilisateur actuel
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }
        
        // Récupérer les patients du médecin connecté
        const { data: patientsData, error } = await supabase
          .from('patients')
          .select('*')
          .eq('doctor_id', user.id)
          .order('last_name', { ascending: true })
        
        if (error) throw error
        
        // Récupérer les rendez-vous pour chaque patient
        const patientsWithMeta = await Promise.all((patientsData || []).map(async (patient) => {
          // Compter les consultations
          const { count: consultationsCount, error: countError } = await supabase
            .from('consultations')
            .select('*', { count: 'exact', head: true })
            .eq('patient_id', patient.id)
          
          // Trouver le dernier rendez-vous
          const { data: appointments, error: appError } = await supabase
            .from('appointments')
            .select('appointment_date')
            .eq('patient_id', patient.id)
            .order('appointment_date', { ascending: false })
            .limit(1)
          
          const lastVisit = appointments && appointments.length > 0 
            ? appointments[0].appointment_date 
            : undefined
          
          return {
            ...patient,
            fullName: `${patient.first_name} ${patient.last_name}`,
            consultationsCount: consultationsCount || 0,
            lastVisit
          }
        }))
        
        setPatients(patientsWithMeta)
      } catch (error) {
        console.error("Erreur lors du chargement des patients:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger la liste des patients",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPatients()
  }, [router, toast])

  // Filtrer les patients en fonction de la recherche
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase()) || 
           (patient.phone && patient.phone.includes(searchQuery))
  })

  // Trier les patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`)
      case "lastVisit":
        if (!a.lastVisit) return 1
        if (!b.lastVisit) return -1
        return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
      case "consultationsCount":
        return (b.consultationsCount || 0) - (a.consultationsCount || 0)
      default:
        return 0
    }
  })

  // Supprimer un patient
  const deletePatient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Mettre à jour la liste des patients
      setPatients(patients.filter(patient => patient.id !== id))
      
      toast({
        title: "Patient supprimé",
        description: "Le patient a été supprimé avec succès."
      })
    } catch (error) {
      console.error("Erreur lors de la suppression du patient:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du patient.",
        variant: "destructive"
      })
    }
  }

  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (dateOfBirth?: string | null) => {
    if (!dateOfBirth) return null
    
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Patients</h1>
        <Link href="/dashboard/patients/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau patient
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un patient par nom ou téléphone..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="lastVisit">Dernière visite</SelectItem>
              <SelectItem value="consultationsCount">Nombre de consultations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-famalink-blue-700"></div>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-12">
          <UserRound className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun patient trouvé</h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchQuery ? "Aucun patient ne correspond à votre recherche." : "Commencez par ajouter un nouveau patient."}
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Effacer la recherche
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedPatients.map((patient) => (
            <Card 
              key={patient.id} 
              className="transition-all hover:shadow-md relative group"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className={`rounded-full p-3 ${
                    patient.gender === "female" 
                      ? "bg-pink-100 text-pink-700" 
                      : "bg-famalink-blue-100 text-famalink-blue-700"
                  }`}>
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{patient.first_name} {patient.last_name}</h3>
                    <p className="text-sm text-gray-500">
                      {calculateAge(patient.date_of_birth) ? `${calculateAge(patient.date_of_birth)} ans` : "Âge non spécifié"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/patients/${patient.id}`)}>
                        Voir le profil
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/patients/${patient.id}/edit`)}>
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/dashboard/calendar/new?patientId=${patient.id}`)}>
                        Nouveau rendez-vous
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => {
                          if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
                            deletePatient(patient.id)
                          }
                        }}
                      >
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Téléphone:</span> {patient.phone}
                  </p>
                  {patient.address && (
                    <p className="text-gray-600 truncate">
                      <span className="font-medium">Adresse:</span> {patient.address}
                    </p>
                  )}
                  {patient.lastVisit && (
                    <p className="text-gray-600">
                      <span className="font-medium">Dernière visite:</span>{" "}
                      {format(new Date(patient.lastVisit), "d MMMM yyyy", { locale: fr })}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">Consultations:</span>{" "}
                    {patient.consultationsCount || 0}
                  </p>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                  >
                    Voir le profil
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => router.push(`/dashboard/calendar/new?patientId=${patient.id}`)}
                  >
                    Nouveau RDV
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}