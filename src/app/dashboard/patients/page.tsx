'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Patient } from '@/types'
import Link from 'next/link'

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setPatients(data || [])
      } catch (error) {
        console.error('Erreur lors du chargement des patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  const filteredPatients = patients.filter(patient => 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Link 
          href="/dashboard/patients/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Nouveau Patient
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un patient..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-10">
          {searchTerm ? 'Aucun patient ne correspond à votre recherche' : 'Aucun patient enregistré'}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de naissance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{patient.first_name} {patient.last_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.date_of_birth || 'Non renseigné'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Voir
                    </button>
                    <button 
                      onClick={() => router.push(`/dashboard/patients/${patient.id}/edit`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 