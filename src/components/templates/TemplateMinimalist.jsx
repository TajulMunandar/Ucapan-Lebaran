import { motion } from 'framer-motion'
import { Sparkles, Calendar, Heart, HandHeart, Moon, Star } from 'lucide-react'

export default function TemplateMinimalist({ data, isPreview = false }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ${isPreview ? 'watermark-preview' : ''}`}>
      {/* Subtle pattern background */}
      <div className="fixed inset-0 opacity-30 dark:opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-rose-200/30 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header with elegant typography */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Moon className="w-5 h-5 text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400 font-medium tracking-[0.2em] uppercase text-xs">
                Eid Al-Fitr 1447 H
              </span>
              <Moon className="w-5 h-5 text-amber-500" />
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-light text-slate-800 dark:text-white mb-4">
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="block"
              >
                Eid
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="block font-bold bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent"
              >
                Mubarak
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-500 dark:text-slate-400 text-lg mb-1"
            >
              Taqabbalallah Minna Wa Minkum
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-slate-400 dark:text-slate-500 text-sm italic"
            >
              (Semoga Allah menerima amalan kita sekalian)
            </motion.p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="w-32 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent mx-auto mb-12"
          />

          {/* Photo */}
          {data.photo_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mb-10"
            >
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-rose-400/30 rounded-3xl transform rotate-1" />
                <div className="relative bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-2xl dark:shadow-slate-900/50">
                  <img
                    src={data.photo_url}
                    alt={data.receiver_name || data.sender_name}
                    className="w-full aspect-[4/5] object-cover rounded-2xl"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Names section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center mb-10"
          >
            {/* From */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Dari</p>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-slate-800 dark:text-white">
                {data.sender_name}
              </h2>
            </div>

            {/* Connector */}
            {data.receiver_name && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-center gap-3 my-4"
                >
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                </motion.div>

                {/* To */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Untuk</p>
                  <h3 className="font-display text-4xl md:text-5xl font-medium text-slate-800 dark:text-white">
                    {data.receiver_name}
                  </h3>
                </div>
              </>
            )}
          </motion.div>

          {/* Message */}
          {data.message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 shadow-lg dark:shadow-slate-900/30 mb-10"
            >
              <div className="flex justify-center mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <p className="font-body text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed text-center whitespace-pre-wrap">
                {data.message}
              </p>
            </motion.div>
          )}

          {/* Footer - More festive */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30 rounded-2xl p-5 mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-slate-800 dark:text-white font-semibold">Minal Aidzin wal Faizin</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                (Semoga kita termasuk yang menjalankan & menerima Eid)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 shadow-sm mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <HandHeart className="w-4 h-4 text-rose-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Mohon Maaf Lahir & Batin</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Mohon maaf jika ada kesalahan 🙏
              </p>
            </div>

            <div className="inline-flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400"
            >
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>1 Syawal 1447 H</span>
              </div>
              <p className="text-xs italic">
                Ramadan telah berlalu, kini saatnya ukir kenangan indah 🔥
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
