import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Eye, 
  Image as ImageIcon,
  RefreshCw,
  Clock,
  DollarSign,
  User
} from 'lucide-react'
import { supabase, PRICE_IDR } from '../lib/supabase'

export default function AdminPaymentsPage() {
  const [pendingPayments, setPendingPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)
  const [selectedProof, setSelectedProof] = useState(null)

  useEffect(() => {
    fetchPendingPayments()
  }, [])

  const fetchPendingPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('greetings')
        .select('*')
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPendingPayments(data || [])
    } catch (err) {
      console.error('Error fetching payments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (greetingId) => {
    setProcessing(greetingId)
    
    try {
      const { error } = await supabase
        .from('greetings')
        .update({ 
          payment_status: 'paid',
          is_paid: true,
          paid_at: new Date().toISOString()
        })
        .eq('id', greetingId)

      if (error) throw error

      // Refresh the list
      await fetchPendingPayments()
    } catch (err) {
      console.error('Error approving payment:', err)
      alert('Failed to approve payment')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (greetingId) => {
    const reason = prompt('Masukkan alasan penolakan (opsional):')
    
    setProcessing(greetingId)
    
    try {
      const { error } = await supabase
        .from('greetings')
        .update({ 
          payment_status: 'rejected',
          payment_proof_url: null
        })
        .eq('id', greetingId)

      if (error) throw error

      // Refresh the list
      await fetchPendingPayments()
    } catch (err) {
      console.error('Error rejecting payment:', err)
      alert('Failed to reject payment')
    } finally {
      setProcessing(null)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Verifikasi Pembayaran
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola pembayaran yang perlu diverifikasi
            </p>
          </div>
          
          <button
            onClick={fetchPendingPayments}
            className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {pendingPayments.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Pending</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {formatPrice(pendingPayments.length * PRICE_IDR)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {new Set(pendingPayments.map(p => p.sender_name)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment List */}
        {pendingPayments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Tidak ada pembayaran yang perlu diverifikasi
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Semua pembayaran telah diproses
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingPayments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span className="font-medium text-amber-700 dark:text-amber-400">
                      Menunggu Verifikasi
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(payment.created_at)}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-4">
                  {/* User Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pengirim</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {payment.sender_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Penerima</p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {payment.receiver_name}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Template</p>
                      <p className="font-medium text-gray-800 dark:text-white capitalize">
                        {payment.template}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Nominal</p>
                      <p className="font-bold text-primary-600 dark:text-primary-400">
                        {formatPrice(PRICE_IDR)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  {payment.payment_proof_url && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Bukti Pembayaran
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProof(payment.payment_proof_url)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat Bukti
                        </button>
                        <a
                          href={payment.payment_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Buka
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Message Preview */}
                  {payment.message && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pesan</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                        {payment.message.length > 100 
                          ? payment.message.substring(0, 100) + '...'
                          : payment.message}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleApprove(payment.id)}
                      disabled={processing === payment.id}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {processing === payment.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(payment.id)}
                      disabled={processing === payment.id}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {processing === payment.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Proof Modal */}
      {selectedProof && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProof(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-4 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                Bukti Pembayaran
              </h3>
              <button
                onClick={() => setSelectedProof(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <img
              src={selectedProof}
              alt="Bukti Pembayaran"
              className="w-full rounded-xl"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
