import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Music, Palette, Send, Loader2, X, Image as ImageIcon, Check, Volume2, VolumeX, FileAudio } from 'lucide-react'
import { useGreeting } from '../context/GreetingContext'
import { TEMPLATES, MUSIC_OPTIONS, PRICE_IDR } from '../lib/supabase'

export default function GreetingForm({ onSuccess }) {
  const { createGreeting, uploadPhoto, loading, error } = useGreeting()
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMusicUrl, setCurrentMusicUrl] = useState(null)
  
  const [formData, setFormData] = useState({
    sender_name: '',
    receiver_name: '',
    message: '',
    template: 'elegant',
    music: 'none',
    customMusic: null,
    customMusicPreview: null,
    photo: null,
    photoPreview: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      const previewUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: previewUrl
      }))
    }
  }

  const removePhoto = () => {
    if (formData.photoPreview) {
      URL.revokeObjectURL(formData.photoPreview)
    }
    setFormData(prev => ({ ...prev, photo: null, photoPreview: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleMusicSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file')
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      
      const previewUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        customMusic: file,
        customMusicPreview: previewUrl,
        music: 'custom'
      }))
      
      // Auto-play custom music
      if (audioRef.current) {
        audioRef.current.src = previewUrl
        audioRef.current.play().catch(err => console.log('Audio play error:', err))
        setCurrentMusicUrl(previewUrl)
        setIsPlaying(true)
      }
    }
  }

  const removeCustomMusic = () => {
    if (formData.customMusicPreview) {
      URL.revokeObjectURL(formData.customMusicPreview)
    }
    setFormData(prev => ({ ...prev, customMusic: null, customMusicPreview: null, music: 'none' }))
    audioRef.current?.pause()
    setIsPlaying(false)
    setCurrentMusicUrl(null)
    if (musicInputRef.current) {
      musicInputRef.current.value = ''
    }
  }

  const musicInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.sender_name.trim() ) {
      alert('Nama pengirim dan penerima wajib diisi')
      return
    }

    try {
      let photoUrl = null
      let musicUrl = null
      
      // Upload photo if exists
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo)
      }

      // Upload custom music if exists
      if (formData.customMusic) {
        musicUrl = await uploadPhoto(formData.customMusic)
      } else {
        // Get music URL from predefined options
        const musicOption = MUSIC_OPTIONS.find(m => m.id === formData.music)
        musicUrl = musicOption?.url
      }
      
      // Create greeting
      const greeting = await createGreeting({
        sender_name: formData.sender_name.trim(),
        receiver_name: formData.receiver_name.trim(),
        message: formData.message.trim() || 'Mohon maaf lahir dan batin',
        template: formData.template,
        photo_url: photoUrl,
        music_url: musicUrl,
      })

      // Call success callback with greeting data
      if (onSuccess) {
        onSuccess(greeting)
      }
    } catch (err) {
      console.error('Error creating greeting:', err)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <ImageIcon className="w-4 h-4 inline mr-1" />
          Foto (Opsional)
        </label>
        
        {formData.photoPreview ? (
          <div className="relative inline-block">
            <img
              src={formData.photoPreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-2xl border-2 border-primary-200"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            <Upload className="w-8 h-8" />
            <span className="text-sm">Klik untuk upload foto</span>
          </button>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama Pengirim *
          </label>
          <input
            type="text"
            name="sender_name"
            value={formData.sender_name}
            onChange={handleInputChange}
            placeholder="Nama Anda"
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nama Penerima (Opsional)
          </label>
          <input
            type="text"
            name="receiver_name"
            value={formData.receiver_name}
            onChange={handleInputChange}
            placeholder="Nama yang recibirá"
            className="input-field"
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Pesan Ucapan
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tulis pesan ucapan Anda... (kosongkan untuk pesan default)"
          rows={4}
          className="input-field resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          {formData.message.length}/500 karakter
        </p>
      </div>

      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Palette className="w-4 h-4 inline mr-1" />
          Pilih Template
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, template: template.id }))}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                formData.template === template.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800 dark:text-white text-sm">
                  {template.name}
                </span>
                {formData.template === template.id && (
                  <Check className="w-4 h-4 text-primary-500" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Music Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Music className="w-4 h-4 inline mr-1" />
          Pilih Musik (Opsional)
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {MUSIC_OPTIONS.map((music) => (
            <button
              key={music.id}
              type="button"
              onClick={() => {
                setFormData(prev => ({ ...prev, music: music.id }))
                
                // Auto-play music when selected
                if (music.url && audioRef.current) {
                  audioRef.current.src = music.url
                  audioRef.current.play().catch(err => console.log('Audio play error:', err))
                  setCurrentMusicUrl(music.url)
                  setIsPlaying(true)
                } else if (!music.url) {
                  // Stop playing if "no music" is selected
                  audioRef.current?.pause()
                  setIsPlaying(false)
                  setCurrentMusicUrl(null)
                }
              }}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                formData.music === music.id
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 text-white'
              }`}
            >
              {music.name}
            </button>
          ))}
          
          {/* Custom music upload button */}
          <button
            type="button"
            onClick={() => musicInputRef.current?.click()}
            className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm flex items-center justify-center gap-2 ${
              formData.music === 'custom'
                ? 'border-primary-500 bg-primary-500 text-white'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 text-white'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Musik</span>
          </button>
        </div>
        
        {/* Custom music file input */}
        <input
          ref={musicInputRef}
          type="file"
          accept="audio/*"
          onChange={handleMusicSelect}
          className="hidden"
        />
        
        {/* Custom music preview */}
        {formData.customMusicPreview && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <FileAudio className="w-5 h-5 text-primary-500" />
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {formData.customMusic?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={removeCustomMusic}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Audio element for preview */}
        <audio ref={audioRef} preload="auto" />
        
        {/* Music controls */}
        {currentMusicUrl && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-primary-500" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {MUSIC_OPTIONS.find(m => m.id === formData.music)?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isPlaying) {
                  audioRef.current?.pause()
                  setIsPlaying(false)
                } else {
                  audioRef.current?.play()
                  setIsPlaying(true)
                }
              }}
              className="px-3 py-1 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        )}
      </div>

      {/* Price Info */}
      <div className="bg-gradient-to-r from-primary-50 to-amber-50 dark:from-primary-900/20 dark:to-amber-900/20 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-white">Harga</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              1x generate link unik
            </p>
          </div>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(PRICE_IDR)}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-4 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Membuat...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Generate Link ({formatPrice(PRICE_IDR)})</span>
          </>
        )}
      </button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm"
        >
          {error}
        </motion.div>
      )}
    </form>
  )
}
