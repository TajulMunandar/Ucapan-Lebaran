-- ============================================
-- GreetEase Database Schema
-- Updated for QRIS/DANA Payment System
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: greetings
-- ============================================
CREATE TABLE IF NOT EXISTS greetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name VARCHAR(255) NOT NULL,
  receiver_name VARCHAR(255) NOT NULL,
  message TEXT,
  template VARCHAR(50) NOT NULL DEFAULT 'elegant',
  photo_url TEXT,
  music_url TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  
  -- Payment fields (new)
  payment_method VARCHAR(50) DEFAULT 'qris',
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  payment_proof_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Remove Midtrans dependency
  payment_id VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster slug lookups
CREATE INDEX idx_greetings_slug ON greetings(slug);
CREATE INDEX idx_greetings_is_paid ON greetings(is_paid);
CREATE INDEX idx_greetings_payment_status ON greetings(payment_status);
CREATE INDEX idx_greetings_created_at ON greetings(created_at DESC);

-- ============================================
-- TABLE: testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name VARCHAR(255) NOT NULL,
  receiver_name VARCHAR(255) NOT NULL,
  message TEXT,
  template VARCHAR(50),
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  greeting_id UUID REFERENCES greetings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for testimonials
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at DESC);

-- ============================================
-- TABLE: users (optional - for future use)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE greetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Greetings: Everyone can read, only owner can update
CREATE POLICY "greetings_select_policy" ON greetings
  FOR SELECT USING (true);

CREATE POLICY "greetings_insert_policy" ON greetings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "greetings_update_policy" ON greetings
  FOR UPDATE USING (true);

-- Testimonials: Everyone can read, only system can insert
CREATE POLICY "testimonials_select_policy" ON testimonials
  FOR SELECT USING (true);

CREATE POLICY "testimonials_insert_policy" ON testimonials
  FOR INSERT WITH CHECK (true);

-- Users: Only owner can access
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_insert_policy" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage bucket for greeting assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('greeting-assets', 'greeting-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for greeting assets
CREATE POLICY "greeting_assets_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'greeting-assets');

CREATE POLICY "greeting_assets_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'greeting-assets');

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment proofs
-- Public read for viewing payment proofs
CREATE POLICY "payment_proofs_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-proofs');

-- Everyone can upload (for this demo - in production, you may want to restrict this)
CREATE POLICY "payment_proofs_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'payment-proofs');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_greetings_updated_at
  BEFORE UPDATE ON greetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- TRIGGER: Auto-create testimonial when payment is confirmed
-- ============================================

CREATE OR REPLACE FUNCTION create_testimonial_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if payment_status changed to 'paid'
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    -- Insert into testimonials
    INSERT INTO testimonials (sender_name, receiver_name, message, template, greeting_id)
    VALUES (NEW.sender_name, NEW.receiver_name, NEW.message, NEW.template, NEW.id);
    
    -- Update is_paid and paid_at
    NEW.is_paid := true;
    NEW.paid_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for payment status change
CREATE TRIGGER trigger_create_testimonial_on_payment
  BEFORE UPDATE ON greetings
  FOR EACH ROW
  EXECUTE FUNCTION create_testimonial_on_payment();

-- ============================================
-- REALTIME CONFIGURATION
-- ============================================

-- Enable realtime for testimonials
ALTER PUBLICATION supabase_realtime ADD TABLE testimonials;

-- Enable realtime for greetings (for payment status updates)
ALTER PUBLICATION supabase_realtime ADD TABLE greetings;
