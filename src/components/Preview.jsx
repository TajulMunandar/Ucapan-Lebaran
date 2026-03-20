import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Lock, ChevronLeft } from 'lucide-react'
import { GreetingTemplate } from './templates'

export default function Preview({ greeting, onBack }) {
  const navigate = useNavigate()

  const handleGoToPayment = () => {
    // Navigate to payment page
    if (greeting?.slug) {
      navigate(`/bayar/${greeting.slug}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Kembali</span>
            </button>
            
            <h2 className="font-medium text-gray-800 dark:text-white">
              Preview Ucapan
            </h2>
            
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-6"
      >
        {/* Template Preview */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
          <GreetingTemplate
            template={greeting?.template}
            data={greeting}
            isPreview={true}
          />
        </div>

        {/* Info */}
        <div className="container mx-auto px-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Link belum aktif
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
                  Selesaikan pembayaran Rp 1.000 untuk mendapatkan link share yang bisa dikirim ke keluarga & teman.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleGoToPayment}
              className="flex-1 btn-primary"
            >
              Bayar Sekarang - Rp 1.000
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Pembayaran via QRIS/DANA • Aman & Terpercaya
          </p>
        </div>
      </motion.div>
    </div>
  )
}
