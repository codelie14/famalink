"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkUser = async () => {
      setIsLoading(true)
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }
        
        if (session) {
          setSession(session)
          setUser(session.user)
          
          // Rediriger vers le dashboard si l'utilisateur est sur la page de connexion ou d'inscription
          if (pathname === "/login" || pathname === "/register") {
            router.push("/dashboard")
          }
        } else {
          setSession(null)
          setUser(null)
          
          // Rediriger vers la page de connexion si l'utilisateur essaie d'accéder à une page protégée
          if (pathname?.startsWith("/dashboard")) {
            router.push("/login")
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setSession(session)
        setUser(session.user)
        
        if (pathname === "/login" || pathname === "/register") {
          router.push("/dashboard")
        }
      }
      
      if (event === "SIGNED_OUT") {
        setSession(null)
        setUser(null)
        router.push("/login")
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [pathname, router])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
} 