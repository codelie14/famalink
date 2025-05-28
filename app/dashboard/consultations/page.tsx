"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Search, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function ConsultationsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Données fictives pour le MVP
  const consultations = [
    {
      id: "1",
      patient: "Konan Kouamé",
      date: "2024-02-15",
      time: "10:00",
      type: "Téléconsultation",
      status: "completed",
    },
    {
      id: "2",
      patient: "Adama Traoré",
      date: "2024-02-20",
      time: "14:30",
      type: "Téléconsultation",
      status: "scheduled",
    },
    {
      id: "3",
      patient: "Aminata Diallo",
      date: "2024-02-22",
      time: "11:00",
      type: "Téléconsultation",
      status: "scheduled",
    },
  ]

  const filteredConsultations = consultations.filter(
    (consultation) =>
      consultation.patient.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Consultations</h1>
        <Link href="/dashboard/calendar/new">
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Nouveau rendez-vous
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher une consultation..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredConsultations.map((consultation) => (
          <Card key={consultation.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-famalink-blue-100 p-3">
                  <Video className="h-5 w-5 text-famalink-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold">{consultation.patient}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(consultation.date).toLocaleDateString()} à{" "}
                    {consultation.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    consultation.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {consultation.status === "completed"
                    ? "Terminée"
                    : "Programmée"}
                </span>
                {consultation.status === "scheduled" && (
                  <Link href={`/dashboard/consultations/${consultation.id}`}>
                    <Button>Démarrer</Button>
                  </Link>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}