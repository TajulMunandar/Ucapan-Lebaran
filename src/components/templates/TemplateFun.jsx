import { motion } from 'framer-motion'
import { PartyPopper, Sparkles, Sparkle } from 'lucide-react'

export default function TemplateFun({ data, isPreview = false }) {
  const colors = ['bg-pink-500', 'bg-purple-500', 'bg-yellow-400', 'bg-green-400', 'bg-blue-500']

  return (
    <div className={`min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-yellow-400 ${isPreview ? 'watermark-preview' : ''}`}>
      {/* Confetti particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 ${colors[i % colors.length]} rounded-full`}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -20,
              scale: 0
            }}
            animate={{ 
              y: window.innerHeight + 20,
              scale: [0, 1, 1, 0],
              x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Header with fun bounce */}
      <div className="container mx-auto px-4 pt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center"
        >
          {/* Fun icons */}
          <div className="flex justify-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <PartyPopper className="w-8 h-8 text-white drop-shadow-lg" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Sparkles className="w-8 h-8 text-yellow-200 drop-shadow-lg" />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <PartyPopper className="w-8 h-8 text-white drop-shadow-lg" />
            </motion.div>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-2">
            <motion.span
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            >
              EID
            </motion.span>{' '}
            <motion.span
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
              className="text-yellow-200"
            >
              MUBARAK!
            </motion.span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/90 text-xl font-medium"
          >
            Hari Raya胶 1447 H
          </motion.p>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-lg mx-auto"
        >
          {/* Fun photo card */}
          {data.photo_url && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="mb-8"
            >
              <div className="relative bg-white rounded-3xl p-3 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img
                  src={data.photo_url}
                  alt={data.receiver_name}
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <motion.div
                  className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-2 shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Names in fun bubbles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mb-8"
          >
            <div className="inline-block bg-white/90 backdrop-blur rounded-2xl px-6 py-4 shadow-lg mb-3">
              <p className="text-sm text-gray-500 uppercase font-medium">Dari</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-purple-600">
                {data.sender_name}
              </h2>
            </div>
            {data.receiver_name && (
              <>
                <div className="text-3xl">⬇️</div>

                <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl px-8 py-4 shadow-lg">
                  <p className="text-sm text-white/80 uppercase font-medium">Untuk</p>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-white">
                    {data.receiver_name}
                  </h3>
                </div>
              </>
            )}
          </motion.div>

          {/* Message in colorful card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            className="bg-white/95 backdrop-blur rounded-3xl p-6 shadow-xl"
          >
            <div className="flex justify-center mb-4">
              <Sparkle className="w-8 h-8 text-pink-500" />
            </div>
            <p className="font-body text-lg text-gray-700 leading-relaxed text-center whitespace-pre-wrap">
              {data.message}
            </p>
          </motion.div>

          {/* Fun footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-center mt-10"
          >
            <p className="text-white font-bold text-lg drop-shadow">
              🙏 Mohon Maaf Lahir & Batin 🙏
            </p>
            <p className="text-white/80 text-sm mt-2">
              Mari Kita Tingkatkan Taqwa
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
