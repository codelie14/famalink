"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccessMessage("")

    // Simuler une mise à jour
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setSuccessMessage("Profil mis à jour avec succès")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Paramètres</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Profil médecin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                defaultValue="Dr. Jean Kouassi"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="jean.k@famalink.com"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue="+225 0789654123"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="speciality">Spécialité</Label>
              <Input
                id="speciality"
                defaultValue="Médecine générale"
                disabled={isLoading}
              />
            </div>

            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Paramètres de consultation</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durée par défaut (minutes)</Label>
              <Input id="duration" type="number" defaultValue="30" min="15" step="15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Tarif consultation (FCFA)</Label>
              <Input id="price" type="number" defaultValue="10000" step="500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buffer">Temps tampon (minutes)</Label>
              <Input id="buffer" type="number" defaultValue="5" min="0" step="5" />
            </div>

            <Button className="w-full">Mettre à jour</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}