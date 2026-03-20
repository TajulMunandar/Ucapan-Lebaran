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
  { id: 'ketipung', name: 'Ketipak Ketipung', url: '/src/assets/Aisha Retno, Aziz Harun - Ketipak Ketipung Raya Official Video.mp3' },
  { id: 'takbir', name: 'Takbirap', url: '/src/assets/ECKO SHOW - TAKBIRAP ft. BOSSVHINO & AIL [lyrics video].mp3' },
  { id: 'eidun', name: 'Eidun Saeed', url: '/src/assets/Eidun Saeed with Maher Zain & Mesut Kurtis ☀️ MiniMuslims.mp3' },
  { id: 'eid', name: 'Eidun Mubarak', url: '/src/assets/Maher Zain - Eidun Mubarak _ Official Music Video.mp3' },
  { id: 'maulana', name: 'Ya Maulana', url: '/src/assets/YA MAULANA - SABYAN (OFFICIAL MUSIC VIDEO).mp3' },
]

// Pricing
export const PRICE_IDR = 5000 // Rp 5,000
