import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Palette, Music, Share2, Clock, Shield, Star, Users } from 'lucide-react'
import Header from '../components/ui/Header'
import GreetingForm from '../components/GreetingForm'
import Preview from '../components/Preview'
import Testimonials from '../components/Testimonials'
import { useGreeting } from '../context/GreetingContext'

export default function HomePage() {
  const { greeting } = useGreeting()
  const [showPreview, setShowPreview] = useState(false)

  const handleFormSuccess = (greetingData) => {
    // Show preview first
    setShowPreview(true)
  }

  const handlePreviewBack = () => {
    setShowPreview(false)
  }

  const handlePaymentSuccess = () => {
    // Could navigate to a success page or show a modal
    console.log('Payment successful!')
  }

  if (showPreview && greeting) {
    return (
      <Preview
        greeting={greeting}
        onBack={handlePreviewBack}
        onSuccess={handlePaymentSuccess}
      />
    )
  }

  return (
    <div className="min-h-screen bg-islamic-light dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>Eid Al-Fitr 1447 H</span>
              </motion.div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
                Kirim Ucapan Lebaran
                <span className="text-gradient block">Yang Spesial</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                Buat & share ucapan Lebaran digital yang elegan dengan foto, musik, & template Cantolan. Gratis diskon 50% untuk periode terbatas!
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a
                  href="#create"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Buat Sekarang
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="#testimonials"
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Lihat Testimoni
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
              >
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">10K+</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ucapan Dibuat</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">5K+</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pelanggan Happy</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">4.9</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Hero Image / Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:pl-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg p-6 md:p-8" id="create">
                <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                  Buat Ucapan Lebaran
                </h2>
                <GreetingForm onSuccess={handleFormSuccess} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Fitur Lengkap
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk membuat ucapan yang tak terlupakan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: '4 Template Eksklusif',
                description: 'Pilih dari Elegant, Islamic, Minimalist, atau Fun yang sesuai dengan gaya Anda',
                color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-500',
              },
              {
                icon: Music,
                title: 'Pilihan Musik',
                description: 'Tambahkan musik yang menyentuh hati untuk accompany tampilan Anda',
                color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-500',
              },
              {
                icon: Share2,
                title: 'Link Share Instan',
                description: 'Bagikan ke WhatsApp, SMS, atau media sosial dengan satu klik',
                color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-500',
              },
              {
                icon: Clock,
                title: 'Cepat & Mudah',
                description: 'Buat ucapan dalam hitungan menit tanpa ribet',
                color: 'bg-green-100 dark:bg-green-900/30 text-green-500',
              },
              {
                icon: Shield,
                title: 'Aman & Terpercaya',
                description: 'Pembayaran melalui QRIS/DANA yang sudah terverifikasi',
                color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-500',
              },
              {
                icon: Star,
                title: 'Kualitas Premium',
                description: 'Desain profesional yang terlihat di berbagai device',
                color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 card-hover"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Template Pilihan
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              4 desain eksklusif yang dibuat dengan cinta untuk keluarga Indonesia
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Elegant', description: 'Klasik & Elegan', color: 'from-amber-400 to-rose-400' },
              { name: 'Islamic', description: 'Nuansa Islami', color: 'from-green-500 to-emerald-600' },
              { name: 'Minimalist', description: 'Sederhana', color: 'from-gray-400 to-gray-600' },
              { name: 'Fun', description: 'Warna-warni', color: 'from-pink-400 via-purple-400 to-yellow-400' },
            ].map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl aspect-[3/4] cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${template.color}`} />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <h3 className="font-display text-2xl font-bold mb-2">{template.name}</h3>
                  <p className="text-white/80 text-sm">{template.description}</p>
                </div>
                <div className="absolute inset-0 border-2 border-white/20 rounded-3xl m-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Testimoni
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Apa kata mereka yang sudah menggunakan GreetEase
            </p>
          </motion.div>

          <Testimonials />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Harga Terjangkau
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Satu harga untuk semua fitur premium, tanpa biaya tersembunyi
            </p>
          </motion.div>

          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg p-8 border-2 border-primary-500 relative overflow-hidden"
            >
              {/* Popular badge */}
              <div className="absolute top-4 right-4 bg-primary-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                TERPOPULER
              </div>

              <div className="text-center mb-8">
                <p className="text-gray-500 dark:text-gray-400 mb-2">Per ucapan</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">Rp</span>
                  <span className="text-5xl font-bold text-primary-600 dark:text-primary-400">5</span>
                  <span className="text-xl text-gray-500">.000</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Sekarang dengan diskon 50%!
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  '4 Template Eksklusif',
                  'Upload Foto Unlimited',
                  'Pilihan Musik',
                  'Link Share Aktif Selamanya',
                  'QR Code Otomatis',
                  'Support via WhatsApp',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#create"
                className="block w-full btn-primary text-center"
              >
                Buat Sekarang
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-islamic relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Sambut Hari Raya dengan Hangat
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Kirim ucapan terbaik untuk keluarga & teman. Mereka akan menghargai effort yang Anda buat.
            </p>
            <a
              href="#create"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Buat Ucapan Sekarang
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-islamic flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="font-display text-xl font-bold">GreetEase</span>
              </div>
              <p className="text-gray-400 text-sm">
                Buat & share ucapan Lebaran digital yang spesial untuk orang tercinta.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Fitur</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Template Eksklusif</li>
                <li>Upload Foto</li>
                <li>Pilihan Musik</li>
                <li>QR Code</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Tentang Kami</li>
                <li>Kontak</li>
                <li>Kebijakan Privasi</li>
                <li>Syarat & Ketentuan</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Hubungi Kami</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>hello@greetease.id</li>
                <li>WhatsApp: +62 895-6255-06370 </li>
                <li>Instagram: @devdadakan.id</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 Developer Dadakan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
