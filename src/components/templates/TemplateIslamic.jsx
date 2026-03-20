import { motion } from 'framer-motion'
import { Building2, Star } from 'lucide-react'

export default function TemplateIslamic({ data, isPreview = false }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-islamic-dark via-green-950 to-islamic-dark ${isPreview ? 'watermark-preview' : ''}`}>
      {/* Background pattern */}
      <div className="relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <Star className="w-8 h-8 text-islamic-gold" />
          </div>
          <div className="absolute top-20 right-20">
            <Star className="w-6 h-6 text-islamic-gold" />
          </div>
          <div className="absolute bottom-20 left-1/4">
            <Star className="w-10 h-10 text-islamic-gold" />
          </div>
          <div className="absolute bottom-10 right-1/3">
            <Star className="w-5 h-5 text-islamic-gold" />
          </div>
        </div>

        {/* Header */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Mosque icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-islamic-gold/20 blur-xl rounded-full" />
                <Building2 className="w-16 h-16 text-islamic-gold relative z-10" />
              </div>
            </motion.div>

            {/* Arabic text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-arabic text-4xl md:text-6xl text-islamic-gold mb-4"
            >
             عيد مبارك
            </motion.p>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Eid Mubarak
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-islamic-gold/80 text-lg tracking-widest"
            >
              1 SYAWAL 1446 H
            </motion.p>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {/* Photo with Islamic frame */}
            {data.photo_url && (
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 border-2 border-islamic-gold/50 rounded-3xl" />
                  <div className="absolute -inset-2 border border-islamic-gold/30 rounded-3xl" />
                  <div className="relative bg-gradient-to-br from-green-900 to-green-800 p-2 rounded-3xl">
                    <img
                      src={data.photo_url}
                      alt={data.receiver_name}
                      className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Names with decoration */}
            <div className="text-center mb-8 space-y-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-islamic-gold/60 text-sm uppercase tracking-widest">Dari</span>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-white">
                  {data.sender_name}
                </h2>
              </motion.div>

              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-islamic-gold" />
                <Star className="w-4 h-4 text-islamic-gold" />
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-islamic-gold" />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <span className="text-islamic-gold/60 text-sm uppercase tracking-widest">Untuk</span>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-islamic-gold">
                  {data.receiver_name}
                </h3>
              </motion.div>
            </div>

            {/* Message card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-sm rounded-3xl p-8 border border-islamic-gold/20"
            >
              <p className="font-body text-lg md:text-xl text-white/90 leading-relaxed text-center whitespace-pre-wrap">
                {data.message}
              </p>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center mt-12"
            >
              <p className="text-islamic-gold/80 font-arabic text-xl mb-2">
                أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ
              </p>
              <p className="text-white/60 text-sm">
                "Mohon maaf lahir dan batin"
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-islamic-gold to-transparent opacity-50" />
      </div>
    </div>
  )
}
