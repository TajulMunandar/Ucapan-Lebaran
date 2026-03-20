import { createContext, useContext, useState, useCallback } from 'react'
import { supabase, generateSlug } from '../lib/supabase'

const GreetingContext = createContext()

export function GreetingProvider({ children }) {
  const [greeting, setGreeting] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Create a new greeting (draft)
  const createGreeting = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    
    try {
      const slug = generateSlug(data.receiver_name)
      
      const greetingData = {
        sender_name: data.sender_name,
        receiver_name: data.receiver_name,
        message: data.message,
        template: data.template,
        photo_url: data.photo_url,
        music_url: data.music_url,
        slug,
        is_paid: false,
      }

      const { data: created, error: insertError } = await supabase
        .from('greetings')
        .insert(greetingData)
        .select()
        .single()

      if (insertError) throw insertError

      setGreeting(created)
      return created
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Get greeting by slug
  const getGreetingBySlug = useCallback(async (slug) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: fetchError } = await supabase
        .from('greetings')
        .select('*')
        .eq('slug', slug)
        .single()

      if (fetchError) throw fetchError

      setGreeting(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update greeting to paid
  const markAsPaid = useCallback(async (slug) => {
    try {
      const { data, error: updateError } = await supabase
        .from('greetings')
        .update({ is_paid: true })
        .eq('slug', slug)
        .select()
        .single()

      if (updateError) throw updateError

      setGreeting(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  // Upload photo to storage
  const uploadPhoto = useCallback(async (file) => {
    try {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error: uploadError } = await supabase.storage
        .from('greeting-assets')
        .upload(`photos/${fileName}`, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('greeting-assets')
        .getPublicUrl(`photos/${fileName}`)

      return publicUrl
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const clearGreeting = useCallback(() => {
    setGreeting(null)
    setError(null)
  }, [])

  return (
    <GreetingContext.Provider value={{
      greeting,
      loading,
      error,
      createGreeting,
      getGreetingBySlug,
      markAsPaid,
      uploadPhoto,
      clearGreeting,
    }}>
      {children}
    </GreetingContext.Provider>
  )
}

export function useGreeting() {
  const context = useContext(GreetingContext)
  if (!context) {
    throw new Error('useGreeting must be used within a GreetingProvider')
  }
  return context
}
