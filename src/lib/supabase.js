import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to generate slug from name
export function generateSlug(name) {
  const timestamp = Date.now().toString(36).slice(-6)
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 10)
  return `${cleanName}-${timestamp}`
}

// Template options
export const TEMPLATES = [
  { id: 'elegant', name: 'Elegant', description: 'Tampilan klasik yang elegan', icon: 'Sparkles' },
  { id: 'islamic', name: 'Islamic', description: 'Desain bernuansa islami', icon: 'Mosque' },
  { id: 'minimalist', name: 'Minimalist', description: 'Sederhana tapi berkesan', icon: 'Minimalist' },
  { id: 'fun', name: 'Fun', description: 'Warna-warni dan penuh semangat', icon: 'PartyPopper' },
]

// Music options
export const MUSIC_OPTIONS = [
  { id: 'none', name: 'Tanpa Musik', url: null },
  { id: 'quran', name: 'Ayat Kursi', url: '/music/quran.mp3' },
  { id: 'ocarina', name: 'Ocarina', url: '/music/ocarina.mp3' },
  { id: 'peaceful', name: 'Tenang', url: '/music/peaceful.mp3' },
  { id: 'celebration', name: 'Merayakan', url: '/music/celebration.mp3' },
]

// Pricing
export const PRICE_IDR = 5000 // Rp 5,000
