import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatage des dates
export function formatDate(date: string | Date, pattern: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, pattern, { locale: fr })
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy à HH:mm')
}

// Formatage du téléphone
export function formatPhone(phone: string): string {
  // Format ivoirien : +225 XX XX XX XX XX
  if (phone.startsWith('+225')) {
    const number = phone.slice(4)
    return `+225 ${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4, 6)} ${number.slice(6, 8)} ${number.slice(8, 10)}`
  }
  return phone
}

// Validation du téléphone ivoirien
export function isValidIvorianPhone(phone: string): boolean {
  const ivorianPhoneRegex = /^(\+225|0)[0-9]{8,10}$/
  return ivorianPhoneRegex.test(phone.replace(/\s/g, ''))
}

// Génération d'initiales
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Calcul de l'âge
export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// Validation d'email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Génération d'ID unique
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Debounce pour les recherches
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}