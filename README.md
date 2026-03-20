# GreetEase - Kartu Ucapan Lebaran Digital

Aplikasi fullstack untuk membuat & share ucapan Lebaran digital berbasis monetisasi.

## 🚀 Fitur

- **Landing Page Modern** - Hero section + form input yang elegan
- **4 Template Eksklusif** - Elegant, Islamic, Minimalist, Fun
- **Upload Foto** - Foto pengguna support
- **Pilihan Musik** - Autoplay musik pengiring
- **Preview Mode** - Lihat sebelum share
- **Payment Gateway** - Midtrans untuk pembayaran
- **Shareable Link** - Format: `/ucapan/:slug`
- **QR Code** - Scan untuk buka ucapan
- **Testimoni Realtime** - Supabase Realtime subscription
- **Dark Mode** - Support tema gelap

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Storage, Realtime, Edge Functions)
- **Payment**: Midtrans
- **Email**: Resend (optional)

## 📋 Prerequisites

1. Node.js 18+
2. Supabase Account
3. Midtrans Account (Sandbox/Production)
4. Resend Account (optional, untuk email)

## ⚡ Setup

### 1. Clone & Install

```bash
cd greetease
npm install
```

### 2. Environment Variables

Copy `.env.example` ke `.env` dan isi dengan kredensial:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
SITE_URL=http://localhost:5173
```

### 3. Supabase Setup

#### Database Schema
Jalankan SQL di Supabase Dashboard > SQL Editor:

```sql
-- Copy isi dari supabase/schema.sql dan jalankan
```

#### Storage
Buat bucket `greeting-assets` di Supabase Storage

#### Edge Functions
Deploy Edge Functions:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy create-payment
supabase functions deploy send-email
```

### 4. Run Development

```bash
npm run dev
```

Buka http://localhost:5173

## 📁 Project Structure

```
greetease/
├── src/
│   ├── components/
│   │   ├── templates/       # Template greeting
│   │   │   ├── TemplateElegant.jsx
│   │   │   ├── TemplateIslamic.jsx
│   │   │   ├── TemplateMinimalist.jsx
│   │   │   └── TemplateFun.jsx
│   │   ├── ui/             # UI components
│   │   ├── GreetingForm.jsx
│   │   ├── Preview.jsx
│   │   ├── Payment.jsx
│   │   └── Testimonials.jsx
│   ├── context/            # React contexts
│   ├── lib/                # Utilities
│   ├── pages/              # Page components
│   └── App.jsx
├── supabase/
│   ├── functions/          # Edge functions
│   └── schema.sql          # Database schema
└── public/
```

## 🔧 Deployment

### Vercel (Frontend)

```bash
npm i -g vercel
vercel
```

Ikuti instruksi untuk deploy. Jangan lupa set environment variables di Vercel dashboard.

### Supabase

Project sudah otomatis di-host di Supabase.

## 📝 License

MIT License
