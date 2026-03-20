import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function TemplateElegant({ data, isPreview = false }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 ${isPreview ? 'watermark-preview' : ''}`}>
      {/* Header decoration */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-200/30 via-transparent to-rose-200/30" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-300/20 rounded-full blur-3xl" />
        
        {/* Decorative elements */}
        <div className="relative container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span className="text-amber-600 font-medium tracking-widest uppercase text-sm">Eid Mubarak</span>
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-800 mb-6">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="block"
              >
                Selamat Hari Raya
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="block text-gradient"
              >
                Eid Al-Fitr
              </motion.span>
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-rose-400 mx-auto rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          {/* Photo frame */}
          {data.photo_url && (
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-rose-500 rounded-3xl transform rotate-2" />
                <div className="relative bg-white p-3 rounded-3xl shadow-lg">
                  <img
                    src={data.photo_url}
                    alt={data.receiver_name}
                    className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Names */}
          <div className="text-center mb-8">
            <p className="text-gray-500 uppercase tracking-wider text-sm mb-2">Ucapan dari</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-gray-800">
              {data.sender_name}
            </h2>
            {data.receiver_name && (
              <>
                <div className="flex items-center justify-center gap-4 my-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
                  <span className="text-amber-500">untuk</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
                </div>

                <h3 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
                  {data.receiver_name}
                </h3>
              </>
            )}
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-soft"
          >
            <p className="font-body text-lg md:text-xl text-gray-700 leading-relaxed text-center whitespace-pre-wrap">
              {data.message}
            </p>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-12"
          >
            <p className="text-gray-500 italic font-body">
              Mohon maaf lahir dan batin
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Diberangkatkan pada tanggal 1 Syawal 1447 H
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
