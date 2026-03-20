import { motion } from 'framer-motion'
import { PartyPopper, Sparkles, Sparkle, Rocket, Heart, Star, HandHeart } from 'lucide-react'

export default function TemplateFun({ data, isPreview = false }) {
  const colors = [
    'bg-pink-500', 'bg-purple-500', 'bg-yellow-400', 'bg-green-400', 
    'bg-blue-500', 'bg-red-500', 'bg-orange-500', 'bg-cyan-500'
  ]
  const emojis = ['🎉', '🎊', '🎈', '⭐', '🌟', '✨', '💫', '🎆']

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 ${isPreview ? 'watermark-preview' : ''}`}>
      {/* Confetti particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${colors[i % colors.length]} rounded-full`}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -20,
              scale: 0
            }}
            animate={{ 
              y: window.innerHeight + 20,
              scale: [0, 1, 1, 0],
              x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 300,
              rotate: Math.random() * 360
            }}
            transition={{ 
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear'
            }}
            style={{
              width: 8 + Math.random() * 8,
              height: 8 + Math.random() * 8,
            }}
          />
        ))}
      </div>

      {/* Floating emojis */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`emoji-${i}`}
            className="absolute text-2xl"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 20,
            }}
            animate={{ 
              y: -50,
              x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200,
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear'
            }}
          >
            {emojis[i % emojis.length]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="relative container mx-auto px-4 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center"
        >
          {/* Fun icons row */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-2 mb-6"
          >
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  rotate: [0, -15, 15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
              >
                <PartyPopper className={`w-8 h-8 ${['text-yellow-300', 'text-pink-300', 'text-green-300', 'text-blue-300'][i % 4]}`} />
              </motion.div>
            ))}
          </motion.div>

          <h1 className="font-display text-6xl md:text-8xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)] mb-3">
            <motion.span
              initial={{ x: -150, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className="inline-block"
            >
              EID
            </motion.span>{' '}
            <motion.span
              initial={{ x: 150, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
              className="inline-block text-yellow-300"
            >
              MUBARAK!
            </motion.span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 text-lg mb-2 font-medium"
          >
            Taqabbalallah Minna Wa Minkum
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-white/60 text-sm italic"
          >
            (Semoga Allah menerima amalan kita sekalian)
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-2 mt-4"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold text-xl">Hari Raya 1447 H</span>
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </motion.div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-lg mx-auto"
        >
          {/* Photo card with fun style */}
          {data.photo_url && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [2, -2, 2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative bg-white rounded-3xl p-4 shadow-2xl"
                >
                  <img
                    src={data.photo_url}
                    alt={data.receiver_name || data.sender_name}
                    className="w-80 h-80 md:w-96 md:h-96 object-cover rounded-2xl"
                  />
                  <motion.div
                    className="absolute -top-4 -right-4 bg-yellow-400 rounded-full p-3 shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Star className="w-6 h-6 text-white fill-white" />
                  </motion.div>
                </motion.div>
                
                {/* Decorative elements around photo */}
                <motion.div
                  className="absolute -top-8 -left-8 text-5xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  🎊
                </motion.div>
                <motion.div
                  className="absolute -bottom-8 -right-8 text-5xl"
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  🎈
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Names in fun bubbles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-8"
          >
            {/* From bubble */}
            <div className="flex justify-center mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/95 backdrop-blur rounded-3xl px-8 py-5 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-pink-500 uppercase">Dari</span>
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  {data.sender_name}
                </h2>
              </motion.div>
            </div>

            {/* Arrow */}
            {data.receiver_name && (
              <>
                <div className="flex justify-center my-3">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-4xl"
                  >
                    ⬇️
                  </motion.div>
                </div>

                {/* To bubble */}
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl px-8 py-5 shadow-xl"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-white/80" />
                      <span className="text-xs font-bold text-white/80 uppercase">Untuk</span>
                    </div>
                    <h3 className="font-display text-4xl md:text-5xl font-black text-white">
                      {data.receiver_name}
                    </h3>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>

          {/* Message in colorful card */}
          {data.message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 }}
              className="bg-white/95 backdrop-blur rounded-3xl p-6 shadow-xl mb-8"
            >
              <div className="flex justify-center mb-3">
                <Sparkle className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="font-body text-lg text-gray-700 leading-relaxed text-center whitespace-pre-wrap">
                {data.message}
              </p>
            </motion.div>
          )}

          {/* Fun footer - More festive */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-center"
          >
            {/* Minal Aidzin */}
            <div className="bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-pink-500/80 backdrop-blur-md rounded-2xl px-6 py-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-2xl"
                >
                  ⭐
                </motion.span>
                <span className="text-white font-bold text-lg">Minal Aidzin wal Faizin</span>
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  className="text-2xl"
                >
                  ⭐
                </motion.span>
              </div>
              <p className="text-white/70 text-xs">
                (Semoga kita termasuk yang menjalankan & menerima Eid)
              </p>
            </div>

            {/* Mohon Maaf */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-xl"
                >
                  🙏
                </motion.span>
                <span className="text-white font-bold">Mohon Maaf Lahir & Batin</span>
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  className="text-xl"
                >
                  🙏
                </motion.span>
              </div>
              <p className="text-white/70 text-sm">
                Dengan hati yang tulus, saya memohon maaf atas segala kesalahan 🔥
              </p>
            </div>
            
            {/* Footer info */}
            <div className="flex items-center justify-center gap-3 text-white/70 text-sm">
              <Rocket className="w-4 h-4" />
              <span>Mari Kita Tingkatkan Taqwa</span>
              <span>•</span>
              <span>1 Syawal 1447 H</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
