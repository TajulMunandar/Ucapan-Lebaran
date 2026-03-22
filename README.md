# GreetEase - Kartu Ucapan Lebaran Digital

Aplikasi fullstack untuk membuat & share ucapan Lebaran digital berbasis monetisasi.

## 🚀 Fitur

- **Landing Page Modern** - Hero section + form input yang elegan
- **4 Template Eksklusif** - Elegant, Islamic, Minimalist, Fun
- **Upload Foto** - Foto pengguna support
- **Pilihan Musik** - Autoplay musik pengiring
- **Preview Mode** - Lihat sebelum share
- **Payment Gateway** - DANA untuk pembayaran otomatis
- **Shareable Link** - Format: `/ucapan/:slug`
- **QR Code** - Scan untuk buka ucapan
- **Testimoni Realtime** - Supabase Realtime subscription
- **Dark Mode** - Support tema gelap

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Storage, Realtime)
- **Payment**: DANA (Sandbox/Production)
- **API**: Vercel Serverless Functions
- **Email**: Resend (optional)

## 📋 Prerequisites

1. Node.js 18+
2. Supabase Account
3. DANA Merchant Account (Sandbox/Production)
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

Edit `.env` dengan kredensial DANA Anda:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# DANA Payment
DANA_API_BASE_URL=https://api.sandbox.dana.id
DANA_MERCHANT_ID=your-merchant-id
DANA_CLIENT_ID=your-client-id
DANA_CLIENT_SECRET=your-client-secret

# Site URL
SITE_URL=http://localhost:5173
```

### 3. Supabase Setup

#### Database Schema
Jalankan SQL di Supabase Dashboard > SQL Editor:

```sql
-- Copy isi dari supabase/schema.sql dan jalankan
```

#### Storage
Buat bucket `greeting-assets` dan `payment-proofs` di Supabase Storage

### 4. Run Development (with API support)

#### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Run with API support
vercel dev
```

Buka http://localhost:5173 - API routes akan tersedia di http://localhost:3000

#### Option B: Using separate terminals
```bash
# Terminal 1: Run Vite dev server
npm run dev

# Terminal 2: Run Vercel API server
npx vercel dev --port 3000
```

### 5. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Ikuti instruksi untuk deploy. Set environment variables di Vercel dashboard:

| Variable | Value |
|----------|-------|
| DANA_API_BASE_URL | https://api.sandbox.dana.id (sandbox) atau https://api.dana.id (production) |
| DANA_MERCHANT_ID | Your DANA merchant ID |
| DANA_CLIENT_ID | Your DANA client ID |
| DANA_CLIENT_SECRET | Your DANA client secret |
| SUPABASE_URL | Your Supabase URL |
| SUPABASE_SERVICE_KEY | Your Supabase service role key |
| SITE_URL | Your Vercel deployment URL |

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
│   │   └── Testimonials.jsx
│   ├── context/            # React contexts
│   ├── lib/                # Utilities
│   ├── pages/              # Page components
│   │   ├── PaymentPage.jsx   # DANA payment integration
│   │   └── SuccessPage.jsx    # Payment success page
│   └── App.jsx
├── api/
│   └── dana/
│       ├── create-payment.js  # Create DANA order
│       ├── finish.js          # DANA callback webhook
│       └── check-status.js    # Check payment status
├── supabase/
│   ├── functions/          # Edge functions
│   └── schema.sql          # Database schema
└── public/
```

## 💳 Payment Flow

1. User membuat ucapan dan klik "Bayar dengan DANA"
2. Backend membuat order DANA → returns payment URL
3. User redirect ke halaman pembayaran DANA
4. User menyelesaikan pembayaran
5. DANA webhook → update status di Supabase
6. User redirect ke `/success?order_id=xxx`
7. Success page polling → redirect ke ucapan

## 📝 License

MIT License
