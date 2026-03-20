import { motion } from 'framer-motion'
import { Sparkles, Moon, Star, Heart, HandHeart } from 'lucide-react'

export default function TemplateElegant({ data, isPreview = false }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${isPreview ? 'watermark-preview' : ''}`}>
      {/* Animated background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Star className="w-2 h-2 text-amber-400 fill-amber-400" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-rose-500/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px]" />
        
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Moon decoration */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="relative">
                <Moon className="w-20 h-20 text-amber-300" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-2 border border-amber-300/30 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-medium tracking-[0.3em] uppercase text-sm">Eid Mubarak</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="block"
              >
                Selamat Hari Raya
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300"
              >
                Eid Al-Fitr 1447 H
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-amber-200/80 text-lg mb-2"
            >
              Taqabbalallah Minna Wa Minkum
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-amber-200/60 text-sm italic"
            >
              (Semoga Allah menerima amalan kita sekalian)
            </motion.p>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-6" 
            />
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Photo frame with glow */}
          {data.photo_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="mb-10 flex justify-center"
            >
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-amber-400/40 to-rose-400/40 rounded-full blur-3xl" />
                <div className="relative bg-white p-3 rounded-3xl shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-rose-400/20 rounded-3xl" />
                  <img
                    src={data.photo_url}
                    alt={data.receiver_name || data.sender_name}
                    className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Names with modern card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 rounded-full px-4 py-1 mb-4">
                <span className="text-amber-400 text-sm font-medium">✨ Dari</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                {data.sender_name}
              </h2>
              {data.receiver_name && (
                <>
                  <div className="flex items-center justify-center gap-3 my-4">
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="text-rose-400">❤️</span>
                    </motion.div>
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    <motion.div 
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <span className="text-rose-400">❤️</span>
                    </motion.div>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-rose-500/20 rounded-full px-4 py-1 mb-4">
                    <span className="text-rose-400 text-sm font-medium">Untuk</span>
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-300">
                    {data.receiver_name}
                  </h3>
                </>
              )}
            </div>
          </motion.div>

          {/* Message */}
          {data.message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
            >
              <div className="flex justify-center mb-4">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed text-center whitespace-pre-wrap">
                {data.message}
              </p>
            </motion.div>
          )}

          {/* Footer - More festive and informative */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center mt-12"
          >
            <div className="bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 rounded-3xl p-6 border border-amber-400/20">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                <span className="text-white font-bold text-lg">Minal Aidzin wal Faizin</span>
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              </div>
              <p className="text-white/70 text-sm mb-2">
                (Semoga kita termasuk yang menjalankan dan menerima Eid)
              </p>
            </div>

            <div className="mt-4 bg-white/10 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HandHeart className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium">Mohon Maaf Lahir & Batin</span>
              </div>
              <p className="text-white/50 text-xs">
                Jika ada kesalahan kata & tindakan, saya memohon maaf yang sebesar-besarnya ✨
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-white/40 text-sm mt-6">
              <span>🗓️ 1 Syawal 1447 H</span>
              <span>•</span>
              <span>🌙 Ramadan 1447 H telah berlalu</span>
              <span>•</span>
              <span>☀️ Selamat Hari Raya</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
