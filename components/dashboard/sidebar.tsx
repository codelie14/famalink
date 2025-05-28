"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Stethoscope, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Video, 
  Settings, 
  LogOut 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"

const navItems = [
  {
    title: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/dashboard/patients",
    icon: Users,
  },
  {
    title: "Rendez-vous",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Consultations",
    href: "/dashboard/consultations",
    icon: Video,
  },
  {
    title: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className="flex flex-col h-full border-r bg-white">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-famalink-blue-700">
          <Stethoscope className="h-6 w-6" />
          <span>FamaLink</span>
        </Link>
      </div>
      <div className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-famalink-blue-50 text-famalink-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 mt-auto border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}