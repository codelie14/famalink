import { NextResponse } from 'next/server'

// Check if the Daily.co API key is defined
const DAILY_API_KEY = process.env.DAILY_API_KEY

if (!DAILY_API_KEY) {
  console.error('DAILY_API_KEY is not defined in environment variables')
}

export async function POST(request: Request) {
  try {
    // Check authentication (to be implemented with your auth system)
    // ...
    
    // Extract consultationId from the request
    const { consultationId } = await request.json()
    
    if (!consultationId) {
      return NextResponse.json(
        { error: 'consultationId is required' },
        { status: 400 }
      )
    }
    
    // Create a Daily.co room
    const room = await createDailyRoom(consultationId)
    
    return NextResponse.json({ roomUrl: room.url })
  } catch (error: any) {
    console.error('Error creating video room:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create video room' },
      { status: 500 }
    )
  }
}

async function createDailyRoom(consultationId: string) {
  // Create a unique room name based on the consultation ID
  const roomName = `famalink-consultation-${consultationId}`
  
  // Configure the room options
  const options = {
    name: roomName,
    properties: {
      exp: Math.floor(Date.now() / 1000) + 3600, // Expiration in 1 hour
      enable_screenshare: true,
      enable_chat: true,
      start_video_off: false,
      start_audio_off: false,
      lang: 'fr',
    },
  }
  
  // Call the Daily.co API
  const response = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify(options),
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Daily API error: ${errorData.error || response.statusText}`)
  }
  
  const room = await response.json()
  return room
}