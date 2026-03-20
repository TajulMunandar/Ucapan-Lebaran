import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Quote, Star } from 'lucide-react'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial testimonials
    fetchTestimonials()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('testimonials')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'testimonials',
        },
        (payload) => {
          setTestimonials(prev => [payload.new, ...prev.slice(0, 5)])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error
      setTestimonials(data || [])
    } catch (err) {
      console.error('Error fetching testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-48 animate-pulse" />
        ))}
      </div>
    )
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <Quote className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Belums testimonials yet. Jadilah yang pertama!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            className="card card-hover"
          >
            {/* Quote icon */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gradient-islamic flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">
                  {testimonial.sender_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">
                  {testimonial.sender_name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Untuk {testimonial.receiver_name}
                </p>
              </div>
            </div>

            {/* Message */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
              "{testimonial.message}"
            </p>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            {/* Date */}
            <p className="text-xs text-gray-400 mt-3">
              {new Date(testimonial.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
