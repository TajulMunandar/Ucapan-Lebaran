import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Copy,
  Clock
} from 'lucide-react'

const POLLING_INTERVAL = 3000 // 3 seconds
const MAX_POLLS = 60 // 3 minutes max

export default function SuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const orderId = searchParams.get('order_id')
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [greeting, setGreeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pollCount, setPollCount] = useState(0)
  const [copied, setCopied] = useState(false)

  // Poll for payment status
  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided')
      setLoading(false)
      return
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/dana/check-status?order_id=${encodeURIComponent(orderId)}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check payment status')
        }

        setPaymentStatus(data.status)
        
        if (data.greeting) {
          setGreeting(data.greeting)
        }

        // If paid, stop polling
        if (data.status === 'paid') {
          setLoading(false)
          return { shouldStop: true }
        }

        // Increment poll count
        setPollCount(prev => {
          if (prev >= MAX_POLLS) {
            setLoading(false)
            return prev
          }
          return prev
        })

      } catch (err) {
        console.error('Error checking payment status:', err)
        // Don't stop polling on error, just log it
      }
    }

    // Initial check
    checkPaymentStatus().then(shouldStop => {
      if (shouldStop) return
    })

    // Set up polling interval
    const interval = setInterval(async () => {
      const shouldStop = await checkPaymentStatus()
      if (shouldStop?.shouldStop) {
        clearInterval(interval)
      }
    }, POLLING_INTERVAL)

    return () => clearInterval(interval)
  }, [orderId])

  // Auto-redirect when paid
  useEffect(() => {
    if (paymentStatus === 'paid' && greeting?.slug) {
      const redirectTimer = setTimeout(() => {
        navigate(`/ucapan/${greeting.slug}`)
      }, 2000)
      return () => clearTimeout(redirectTimer)
    }
  }, [paymentStatus, greeting, navigate])

  const copyLink = () => {
    if (greeting?.slug) {
      const link = `${window.location.origin}/ucapan/${greeting.slug}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatTimeRemaining = () => {
    const remaining = Math.max(0, (MAX_POLLS - pollCount) * (POLLING_INTERVAL / 1000))
    const mins = Math.floor(remaining / 60)
    const secs = remaining % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Menunggu Pembayaran
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Memeriksa status pembayaran...
          </p>
          <p className="text-sm text-gray-500">
            Harap tunggu sejenak atau selesaikan pembayaran di aplikasi DANA
          </p>
          <div className="mt-6 text-sm text-gray-400">
            Waktu tersisa: {formatTimeRemaining()}
          </div>
        </motion.div>
      </div>
    )
  }

  if (error && !greeting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="btn-primary inline-flex items-center gap-2">
              Buat Ucapan Baru
            </a>
            {orderId && (
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Coba Lagi
              </button>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Payment successful
  if (paymentStatus === 'paid' && greeting) {
    const shareUrl = `${window.location.origin}/ucapan/${greeting.slug}`
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Pembayaran Berhasil!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Terima kasih! Ucapan lebaran Anda telah aktif.
          </p>

          {/* Greeting Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 text-left shadow-lg">
            <h4 className="font-medium text-gray-800 dark:text-white mb-3">
              Detail Ucapan
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Dari:</span>
                <span className="text-gray-800 dark:text-white">{greeting.sender_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Untuk:</span>
                <span className="text-gray-800 dark:text-white">{greeting.receiver_name}</span>
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Bagikan link ucapan:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-sm"
              />
              <button
                onClick={copyLink}
                className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Redirect message */}
          <p className="text-sm text-gray-500 mb-4">
            Mengalihkan ke halaman ucapan...
          </p>

          {/* Actions */}
          <a
            href={`/ucapan/${greeting.slug}`}
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
          >
            Lihat Ucapan Sekarang <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    )
  }

  // Payment failed/expired
  if (paymentStatus === 'rejected' || paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Pembayaran Gagal
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Pembayaran Anda tidak berhasil. Silakan coba lagi.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {greeting?.slug && (
              <a
                href={`/bayar/${greeting.slug}`}
                className="btn-primary inline-flex items-center gap-2"
              >
                Coba Lagi
              </a>
            )}
            <a href="/" className="btn-secondary inline-flex items-center gap-2">
              Buat Ucapan Baru
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  // Timeout - still pending after max polls
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Waktu Habis
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Pemeriksaan waktu habis. Silakan periksa status pembayaran Anda di aplikasi DANA atau coba lagi.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {greeting?.slug && (
            <a
              href={`/bayar/${greeting.slug}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              Kembali ke Pembayaran
            </a>
          )}
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Periksa Lagi
          </button>
        </div>
      </motion.div>
    </div>
  )
}


