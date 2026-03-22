import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GreetingProvider } from './context/GreetingContext'
import HomePage from './pages/HomePage'
import GreetingPage from './pages/GreetingPage'
import PaymentPage from './pages/PaymentPage'
import SuccessPage from './pages/SuccessPage'
import AdminPaymentsPage from './pages/AdminPaymentsPage'
import { useEffect } from 'react'

export default function App() {
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <GreetingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ucapan/:slug" element={<GreetingPage />} />
          <Route path="/bayar/:slug" element={<PaymentPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
        </Routes>
      </BrowserRouter>
    </GreetingProvider>
  )
}
