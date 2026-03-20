import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  QrCode, 
  Upload, 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Clock,
  Image as ImageIcon,
  X
} from 'lucide-react'
import { supabase, PRICE_IDR } from '../lib/supabase'
import DANAImage from '../assets/dana.jpeg'

export default function PaymentPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [greeting, setGreeting] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [paymentProof, setPaymentProof] = useState(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState(null)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes countdown
  
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/ucapan/${slug}` : ''

  // Fetch greeting data
  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('greetings')
          .select('*')
          .eq('slug', slug)
          .single()

        if (fetchError) throw fetchError
        
        // If already paid, redirect to greeting page
        if (data.payment_status === 'paid') {
          navigate(`/ucapan/${slug}`)
          return
        }
        
        setGreeting(data)
        setPaymentProofPreview(data.payment_proof_url)
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

  // Countdown timer
  useEffect(() => {
    if (greeting?.payment_status !== 'pending') return
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [greeting?.payment_status])

  // Poll for payment status
  useEffect(() => {
    if (!slug || greeting?.payment_status === 'paid') return

    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('greetings')
        .select('payment_status, is_paid')
        .eq('slug', slug)
        .single()
      
      if (data?.payment_status === 'paid') {
        clearInterval(interval)
        navigate(`/ucapan/${slug}`)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [slug, greeting?.payment_status, navigate])

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      const previewUrl = URL.createObjectURL(file)
      setPaymentProof(file)
      setPaymentProofPreview(previewUrl)
    }
  }

  const removePhoto = () => {
    if (paymentProofPreview && paymentProofPreview.startsWith('blob:')) {
      URL.revokeObjectURL(paymentProofPreview)
    }
    setPaymentProof(null)
    setPaymentProofPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadPaymentProof = async () => {
    if (!paymentProof) return null
    
    try {
      const fileName = `proof-${greeting.id}-${Date.now()}.${paymentProof.name.split('.').pop()}`
      
      const { data, error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, paymentProof)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (err) {
      console.error('Upload error:', err)
      throw err
    }
  }

  const handleConfirmPayment = async () => {
    if (!greeting) return
    
    setSubmitting(true)
    setError(null)

    try {
      let proofUrl = greeting.payment_proof_url

      // Upload new proof if selected
      if (paymentProof) {
        proofUrl = await uploadPaymentProof()
      }

      if (!proofUrl) {
        throw new Error('Bukti pembayaran wajib diupload')
      }

      // Update payment status to pending_verification
      const { error: updateError } = await supabase
        .from('greetings')
        .update({ 
          payment_status: 'pending',
          payment_proof_url: proofUrl,
          payment_method: 'qris'
        })
        .eq('id', greeting.id)

      if (updateError) throw updateError

      // Update local state
      setGreeting(prev => ({
        ...prev,
        payment_status: 'pending',
        payment_proof_url: proofUrl
      }))

    } catch (err) {
      console.error('Confirm payment error:', err)
      setError(err.message || 'Terjadi kesalahan saat upload bukti pembayaran')
    } finally {
      setSubmitting(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Memuat...</p>
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
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <a href="/" className="btn-primary inline-flex items-center gap-2">
            Buat Ucapan Baru
          </a>
        </motion.div>
      </div>
    )
  }

  const isPending = greeting?.payment_status === 'pending'
  const isPaid = greeting?.payment_status === 'paid'
  const isUnpaid = greeting?.payment_status === 'unpaid'

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-amber-500 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">
              Pembayaran QRIS
            </h1>
            <p className="text-white/80 text-sm">
              Scan QR untuk membayar
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {isPending && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl flex items-center gap-2"
              >
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span>Bukti pembayaran sudah diupload. Mohon tunggu verifikasi dari admin.</span>
              </motion.div>
            )}

            {/* Greeting Summary */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                Ringkasan Ucapan
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Dari:</span>
                  <span className="text-gray-800 dark:text-white">{greeting?.sender_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Untuk:</span>
                  <span className="text-gray-800 dark:text-white">{greeting?.receiver_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Template:</span>
                  <span className="text-gray-800 dark:text-white capitalize">{greeting?.template}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-800 dark:text-white">Total:</span>
                    <span className="text-primary-600 dark:text-primary-400">{formatPrice(PRICE_IDR)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section - Only show if unpaid */}
            {isUnpaid && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Scan QR Code berikut dengan aplikasi DANA, GoPay, atau QRIS lainnya
                </p>
                
                <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4">
                  <img 
                    src={DANAImage} 
                    alt="QRIS DANA"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                
                <p className="text-xs text-gray-400 mb-4">
                  Atau klik tombol di bawah setelah melakukan pembayaran
                </p>
              </div>
            )}

            {/* Payment Proof Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Upload className="w-4 h-4 inline mr-1" />
                Bukti Pembayaran *
              </label>
              
              {paymentProofPreview ? (
                <div className="relative inline-block">
                  <img
                    src={paymentProofPreview}
                    alt="Bukti Pembayaran"
                    className="w-full max-h-48 object-contain rounded-2xl border-2 border-primary-200 dark:border-primary-800"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-sm">Klik untuk upload bukti transfer</span>
                </button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {/* Confirm Payment Button */}
            {isUnpaid && (
              <button
                onClick={handleConfirmPayment}
                disabled={!paymentProofPreview || submitting}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Saya sudah bayar</span>
                  </>
                )}
              </button>
            )}

            {/* Pending Status */}
            {isPending && (
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Menunggu Verifikasi
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Admin akan memverifikasi pembayaran Anda dalam waktu singkat.
                </p>
                <p className="text-sm text-gray-500">
                  Halaman ini akan otomatis redirect setelah pembayaran diverifikasi.
                </p>
              </div>
            )}

            {/* Share Link */}
            {(isPending || isPaid) && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Link Ucapan:</p>
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
            )}

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Cara Pembayaran:
              </h4>
              <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
                <li>Buka aplikasi DANA, GoPay, atau QRIS</li>
                <li>Pilih fitur "Scan QR"</li>
                <li>Scan QR Code di atas</li>
                <li>Masukkan nominal {formatPrice(PRICE_IDR)}</li>
                <li>Selesaikan pembayaran</li>
                <li>Upload screenshot bukti transfer di atas</li>
                <li>Klik "Saya sudah bayar"</li>
              </ol>
            </div>

            {/* Back to Home */}
            <a
              href="/"
              className="block text-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
            >
              ← Buat Ucapan Baru
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
