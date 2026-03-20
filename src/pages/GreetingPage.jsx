import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Copy, QrCode, Share2, Loader2, AlertCircle, ExternalLink, Lock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { GreetingTemplate } from '../components/templates'
import { QRCodeSVG } from 'qrcode.react'
import { useGreeting } from '../context/GreetingContext'

export default function GreetingPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getGreetingBySlug, loading: contextLoading, error: contextError } = useGreeting()
  const [greeting, setGreeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/ucapan/${slug}` : ''

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('greetings')
          .select('*')
          .eq('slug', slug)
          .single()
        
        // Check if greeting exists
        if (fetchError || !data) {
          navigate('/')
          return
        }

        // Check payment status - only allow access if paid
        if (data.payment_status !== 'paid') {
          // Redirect to payment page if not paid
          navigate(`/bayar/${slug}`)
          return
        }

        setGreeting(data)
      } catch (err) {
        console.error('Error fetching greeting:', err)
        setError('Greeting not found')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchGreeting()
    }
  }, [slug, navigate])

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Memuat ucapan...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !greeting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Ucapan Tidak Ditemukan
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Link yang Anda akses mungkin salah atau sudah expired
          </p>
          <a href="/" className="btn-primary inline-flex items-center gap-2">
            Buat Ucapan Baru
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Greeting Template */}
      <GreetingTemplate
        template={greeting.template}
        data={greeting}
        isPreview={false}
      />

      {/* Action Buttons - Fixed at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="container mx-auto max-w-md flex gap-3">
          {/* Copy Link */}
          <button
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-800 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {copied ? (
              <>
                <span className="text-green-500">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* QR Code */}
          <button
            onClick={() => setShowQR(!showQR)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-800 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <QrCode className="w-5 h-5" />
            <span>QR Code</span>
          </button>

          {/* Share */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`Ucapan Lebaran dari ${greeting.sender_name} untuk ${greeting.receiver_name}: ${shareUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </a>
        </div>
      </motion.div>

      {/* QR Code Modal */}
      {showQR && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowQR(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">
              Scan QR Code
            </h3>
            <div className="bg-white p-4 rounded-2xl inline-block mb-4">
              <QRCodeSVG value={shareUrl} size={200} level="H" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Atau buka langsung: {shareUrl}
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full btn-secondary"
            >
              Tutup
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Music Player (if music is selected) */}
      {greeting.music_url && (
        <audio autoPlay loop className="hidden">
          <source src={greeting.music_url} type="audio/mpeg" />
        </audio>
      )}

      {/* Bottom padding for fixed buttons */}
      <div className="h-24" />
    </div>
  )
}
