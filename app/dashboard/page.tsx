"use client"

import { useState, useEffect } from "react"
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  ArrowUpRight, 
  ArrowDownRight,
  BarChart4,
  Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type AppointmentType = {
  id: number;
  patientName: string;
  time: string;
  date: string;
  type: 'teleconsultation' | 'in-person';
}

type StatsType = {
  totalPatients: number;
  totalAppointments: number;
  completedConsultations: number;
  upcomingAppointments: AppointmentType[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsType>({
    totalPatients: 0,
    totalAppointments: 0,
    completedConsultations: 0,
    upcomingAppointments: []
  })

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setStats({
        totalPatients: 124,
        totalAppointments: 56,
        completedConsultations: 43,
        upcomingAppointments: [
          { id: 1, patientName: "Sophie Martin", time: "10:00", date: "2023-06-15", type: "teleconsultation" },
          { id: 2, patientName: "Thomas Dubois", time: "11:30", date: "2023-06-15", type: "in-person" },
          { id: 3, patientName: "Emma Bernard", time: "14:00", date: "2023-06-15", type: "teleconsultation" },
          { id: 4, patientName: "Lucas Petit", time: "16:30", date: "2023-06-16", type: "teleconsultation" }
        ]
      })
    }, 1000)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Button>
          Nouveau rendez-vous
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+12%</span> depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Rendez-vous
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+8%</span> depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Consultations
            </CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedConsultations}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              <span className="text-red-500 font-medium">-3%</span> depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de complétion
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalAppointments ? Math.round((stats.completedConsultations / stats.totalAppointments) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500 font-medium">+5%</span> depuis le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Prochains rendez-vous */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
            <CardDescription>
              Vos rendez-vous à venir pour aujourd'hui et demain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-10 rounded-full ${appointment.type === 'teleconsultation' ? 'bg-famalink-blue-500' : 'bg-green-500'}`} />
                    <div>
                      <div className="font-medium">{appointment.patientName}</div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Clock className="mr-1 h-3 w-3" /> {appointment.time}
                        <span className="mx-1">•</span>
                        <span className="capitalize">{appointment.type === 'teleconsultation' ? 'Vidéo' : 'En personne'}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              ))}
              {stats.upcomingAppointments.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun rendez-vous à venir
                </div>
              )}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/calendar">
                <Button variant="link" className="p-0">Voir tous les rendez-vous →</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Graphique d'activité */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Aperçu de votre activité sur les 30 derniers jours
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px]">
            <div className="text-center flex flex-col items-center justify-center text-muted-foreground">
              <BarChart4 className="h-16 w-16 mb-2" />
              <p>Les graphiques d'activité seront disponibles prochainement</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}