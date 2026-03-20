import { motion } from 'framer-motion'
import {  Star, Moon, Sun, Heart, HandHeart } from 'lucide-react'

export default function TemplateIslamic({ data, isPreview = false }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-950 via-emerald-900 to-green-950 ${isPreview ? 'watermark-preview' : ''}`}>
      {/* Animated decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Star className={`w-${3 + (i % 4)} h-${3 + (i % 4)} text-yellow-400/50`} />
          </motion.div>
        ))}
      </div>

      {/* Top decorative light */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-yellow-400/10 to-transparent" />

      {/* Header */}
      <div className="relative container mx-auto px-4 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Mosque icon with glow */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="inline-flex items-center justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 p-6 rounded-full">
                {/* <Mosque2 className="w-20 h-20 text-yellow-300" /> */}
              </div>
            </div>
          </motion.div>

          {/* Arabic Eid Mubarak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <p className="font-arabic text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 drop-shadow-lg">
             عيد مبارك
            </p>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-display text-5xl md:text-7xl font-bold text-white mb-3"
          >
            Eid Mubarak
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-yellow-200/80 text-lg mb-1"
          >
            Taqabbalallah Minna Wa Minkum
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-yellow-200/50 text-sm italic"
          >
            (Semoga Allah menerima amalan kita sekalian)
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex items-center justify-center gap-4 mt-4"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Sun className="w-6 h-6 text-yellow-400" />
            </motion.div>
            <p className="text-yellow-300/80 text-lg tracking-[0.3em] font-medium">
              1 SYAWAL 1447 H
            </p>
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Moon className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Photo with ornate frame */}
          {data.photo_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-10 flex justify-center"
            >
              <div className="relative">
                {/* Decorative frame layers */}
                <div className="absolute -inset-8 border-2 border-yellow-400/30 rounded-3xl" />
                <div className="absolute -inset-6 border border-yellow-400/20 rounded-3xl" />
                <div className="absolute -inset-3 bg-gradient-to-br from-yellow-400/10 to-green-400/10 rounded-3xl" />
                
                <motion.div 
                  className="relative bg-gradient-to-br from-green-800 to-green-900 p-4 rounded-3xl"
                  animate={{ boxShadow: ['0 0 30px rgba(250, 204, 21, 0.3)', '0 0 50px rgba(250, 204, 21, 0.4)', '0 0 30px rgba(250, 204, 21, 0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <img
                    src={data.photo_url}
                    alt={data.receiver_name || data.sender_name}
                    className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Names section with elegant design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-gradient-to-br from-green-900/60 to-emerald-900/40 backdrop-blur-md rounded-3xl p-8 border border-yellow-400/20 mb-8"
          >
            {/* From */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2 }}
                className="inline-flex items-center gap-2 bg-yellow-400/10 rounded-full px-4 py-1 mb-3"
              >
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-sm font-medium uppercase tracking-wider">Dari</span>
                <Star className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
                {data.sender_name}
              </h2>
            </div>

            {/* To (conditional) */}
            {data.receiver_name && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-3 my-4">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-2xl"
                  >
                    🤲
                  </motion.span>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
                </div>
                
                <div className="inline-flex items-center gap-2 bg-yellow-400/20 rounded-full px-4 py-1 mb-3">
                  <span className="text-yellow-200 text-sm font-medium uppercase tracking-wider">Untuk</span>
                </div>
                <h3 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200">
                  {data.receiver_name}
                </h3>
              </motion.div>
            )}
          </motion.div>

          {/* Message card */}
          {data.message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 backdrop-blur-sm rounded-3xl p-8 border border-yellow-400/10"
            >
              <div className="flex justify-center mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed text-center whitespace-pre-wrap">
                {data.message}
              </p>
            </motion.div>
          )}

          {/* Footer with Islamic prayers - More festive */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-to-r from-yellow-500/20 via-green-500/20 to-yellow-500/20 py-6 rounded-3xl border border-yellow-400/20 mb-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Heart className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold text-xl">Minal Aidzin wal Faizin</span>
                <Heart className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-white/60 text-sm">
                (Semoga kita termasuk yang menjalankan & menerima Eid)
              </p>
            </div>

            <div className="bg-green-900/40 rounded-2xl p-5 border border-yellow-400/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HandHeart className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">Mohon Maaf Lahir & Batin</span>
              </div>
              <p className="text-white/50 text-sm">
                Dengan hati yang tulus, saya memohon maaf atas segala kesalahan ✨
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-white/40 text-sm mt-6">
              <span>🌙 Ramadan 1447 H</span>
              <span>→</span>
              <span>☀️ Syawal 1447 H</span>
              <span>→</span>
              <span>❤️ Minal Aidzin</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom decorative light */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-400/5 to-transparent" />
    </div>
  )
}
