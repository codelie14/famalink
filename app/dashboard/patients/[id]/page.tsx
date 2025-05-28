"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, FileText, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  // Données fictives pour le MVP
  const patient = {
    id: params.id,
    name: "Konan Kouamé",
    age: 45,
    phone: "+225 0789453621",
    email: "konan.k@email.com",
    address: "Cocody, Abidjan",
    bloodType: "A+",
    consultations: [
      {
        id: "1",
        date: "2024-02-15",
        type: "Téléconsultation",
        symptoms: "Fièvre, maux de tête",
        diagnosis: "Paludisme",
        prescription: "Coartem 80mg, 2x par jour pendant 3 jours",
      },
      {
        id: "2",
        date: "2024-01-20",
        type: "Téléconsultation",
        symptoms: "Toux sèche, fatigue",
        diagnosis: "Bronchite",
        prescription: "Amoxicilline 500mg, 3x par jour pendant 7 jours",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/patients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{patient.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Informations personnelles</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">{patient.age} ans</p>
                <p className="text-sm text-gray-500">Groupe sanguin: {patient.bloodType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">{patient.phone}</p>
                <p className="text-sm text-gray-500">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Patient depuis</p>
                <p className="text-sm text-gray-500">Janvier 2024</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Historique des consultations</h2>
            <Link href={`/dashboard/consultations/new?patient=${patient.id}`}>
              <Button>Nouvelle consultation</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {patient.consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-famalink-blue-600" />
                    <p className="font-medium">
                      {new Date(consultation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-famalink-blue-100 px-3 py-1 text-sm text-famalink-blue-700">
                    {consultation.type}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Symptômes:</span>{" "}
                    {consultation.symptoms}
                  </p>
                  <p>
                    <span className="font-medium">Diagnostic:</span>{" "}
                    {consultation.diagnosis}
                  </p>
                  <p>
                    <span className="font-medium">Prescription:</span>{" "}
                    {consultation.prescription}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}