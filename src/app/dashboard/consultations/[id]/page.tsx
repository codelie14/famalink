'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Consultation, Patient, DailyCallObject } from '@/types'

// Importation dynamique du SDK Daily.co
import DailyIframe from '@daily-co/daily-js'

export default function ConsultationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [prescription, setPrescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  // État de la vidéo
  const [callObject, setCallObject] = useState<DailyCallObject | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  
  // Référence au conteneur vidéo
  const videoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchConsultationData() {
      try {
        setLoading(true)
        
        // Fetch consultation details
        const { data: consultationData, error: consultationError } = await supabase
          .from('consultations')
          .select(`
            *,
            patient:patients(*)
          `)
          .eq('id', params.id)
          .single()
        
        if (consultationError) throw consultationError
        
        setConsultation(consultationData)
        setPatient(consultationData.patient)
        
        // Set form values from consultation data
        if (consultationData.notes) setNotes(consultationData.notes)
        if (consultationData.diagnosis) setDiagnosis(consultationData.diagnosis)
        if (consultationData.prescription) setPrescription(consultationData.prescription)
        
        // Create Daily.co room if needed
        if (!consultationData.video_room_url) {
          await createVideoRoom(consultationData.id)
        } else {
          initializeVideoCall(consultationData.video_room_url)
        }
        
      } catch (error: any) {
        console.error('Erreur lors du chargement de la consultation:', error)
        setError(error.message || 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchConsultationData()
    
    // Cleanup on unmount
    return () => {
      if (callObject) {
        callObject.leave()
      }
    }
  }, [params.id])

  const createVideoRoom = async (consultationId: string) => {
    try {
      // Call your API to create a Daily.co room
      const response = await fetch('/api/video-rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ consultationId }),
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la salle vidéo')
      }
      
      const { roomUrl } = await response.json()
      
      // Update consultation with room URL
      const { error } = await supabase
        .from('consultations')
        .update({ video_room_url: roomUrl })
        .eq('id', consultationId)
      
      if (error) throw error
      
      // Initialize video call with the new room URL
      initializeVideoCall(roomUrl)
      
    } catch (error) {
      console.error('Erreur lors de la création de la salle vidéo:', error)
      setError('Impossible de créer la salle de consultation vidéo')
    }
  }

  const initializeVideoCall = (roomUrl: string) => {
    if (!videoContainerRef.current) return
    
    try {
      // Create Daily call object
      const dailyCall = DailyIframe.createCallObject({
        url: roomUrl,
        dailyConfig: {
          experimentalChromeVideoMuteLightOff: true,
        },
      })
      
      // Set up event listeners
      dailyCall.on('joined-meeting', () => {
        setIsJoined(true)
      })
      
      dailyCall.on('left-meeting', () => {
        setIsJoined(false)
      })
      
      // Store call object in state
      setCallObject(dailyCall)
      
      // Join the call
      dailyCall.join()
      
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'appel vidéo:', error)
      setError('Impossible d\'initialiser l\'appel vidéo')
    }
  }

  const toggleMicrophone = () => {
    if (callObject) {
      const newState = !isMicOn
      callObject.setLocalAudio(newState)
      setIsMicOn(newState)
    }
  }

  const toggleCamera = () => {
    if (callObject) {
      const newState = !isCameraOn
      callObject.setLocalVideo(newState)
      setIsCameraOn(newState)
    }
  }

  const endCall = async () => {
    if (callObject) {
      callObject.leave()
    }
    
    // Save consultation notes before leaving
    await saveConsultation()
    
    // Redirect to patient page
    if (patient) {
      router.push(`/dashboard/patients/${patient.id}`)
    } else {
      router.push('/dashboard/consultations')
    }
  }

  const saveConsultation = async () => {
    if (!consultation) return
    
    try {
      setIsSaving(true)
      
      const { error } = await supabase
        .from('consultations')
        .update({
          notes,
          diagnosis,
          prescription,
          updated_at: new Date().toISOString()
        })
        .eq('id', consultation.id)
      
      if (error) throw error
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la consultation:', error)
      setError('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Chargement de la consultation...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Retour
        </button>
      </div>
    )
  }

  if (!consultation || !patient) {
    return <div className="container mx-auto px-4 py-8 text-center">Consultation non trouvée</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Consultation avec {patient.first_name} {patient.last_name}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video container - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {/* Video container */}
            <div 
              ref={videoContainerRef} 
              className="aspect-video w-full"
              style={{ height: '500px' }}
            ></div>
            
            {/* Video controls */}
            <div className="bg-gray-900 p-4 flex justify-center space-x-4">
              <button
                onClick={toggleMicrophone}
                className={`p-3 rounded-full ${
                  isMicOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {isMicOn ? 'Micro ON' : 'Micro OFF'}
              </button>
              <button
                onClick={toggleCamera}
                className={`p-3 rounded-full ${
                  isCameraOn ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                } text-white`}
              >
                {isCameraOn ? 'Caméra ON' : 'Caméra OFF'}
              </button>
              <button
                onClick={endCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white"
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
        
        {/* Notes container - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
            <h2 className="text-lg font-medium mb-3">Notes de consultation</h2>
            
            <div className="space-y-4 flex-grow">
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Symptômes & Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={6}
                  placeholder="Notes de consultation..."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Diagnostic</label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                  placeholder="Diagnostic..."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1 text-sm">Prescription</label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={4}
                  placeholder="Prescription..."
                />
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={saveConsultation}
                disabled={isSaving}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les notes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 