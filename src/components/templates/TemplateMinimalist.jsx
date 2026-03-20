import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'

export default function TemplateMinimalist({ data, isPreview = false }) {
  return (
    <div className={`min-h-screen bg-white dark:bg-gray-900 ${isPreview ? 'watermark-preview' : ''}`}>
      {/* Minimalist geometric accents */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-900 dark:bg-white" />
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-900 dark:bg-white" />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-xl mx-auto"
        >
          {/* Top decoration */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-2">
              <Minus className="w-8 h-px bg-gray-300 dark:bg-gray-700" />
              <Plus className="w-3 h-3 text-gray-400" />
              <Minus className="w-8 h-px bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>

          {/* Photo - Simple square */}
          {data.photo_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-10"
            >
              <div className="relative aspect-square max-w-xs mx-auto">
                <img
                  src={data.photo_url}
                  alt={data.receiver_name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 border border-gray-200 dark:border-gray-700 -m-2 -z-10" />
              </div>
            </motion.div>
          )}

          {/* Main greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-4">
              Eid Al-Fitr 1447 H
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-gray-900 dark:text-white">
              {data.sender_name}
            </h1>
            {data.receiver_name && (
              <>
                <div className="flex items-center justify-center gap-4 my-4">
                  <div className="w-4 h-px bg-gray-300 dark:bg-gray-700" />
                  <span className="text-gray-400 text-sm">to</span>
                  <div className="w-4 h-px bg-gray-300 dark:bg-gray-700" />
                </div>

                <h2 className="font-display text-4xl md:text-5xl font-light text-gray-900 dark:text-white">
                  {data.receiver_name}
                </h2>
              </>
            )}
          </motion.div>

          {/* Message - Clean typography */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-12"
          >
            <p className="font-body text-base md:text-lg text-gray-600 dark:text-gray-300 leading-7 text-center whitespace-pre-wrap">
              {data.message}
            </p>
          </motion.div>

          {/* Bottom decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-3 h-3 text-gray-400" />
              <Minus className="w-8 h-px bg-gray-300 dark:bg-gray-700" />
            </div>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center text-xs text-gray-400 mt-12 font-light"
          >
            Mohon maaf lahir dan batin
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
