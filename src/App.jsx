import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './context/DarkModeContext'
import { GreetingProvider } from './context/GreetingContext'
import HomePage from './pages/HomePage'
import GreetingPage from './pages/GreetingPage'
import PaymentPage from './pages/PaymentPage'
import AdminPaymentsPage from './pages/AdminPaymentsPage'

export default function App() {
  return (
    <DarkModeProvider>
      <GreetingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ucapan/:slug" element={<GreetingPage />} />
            <Route path="/bayar/:slug" element={<PaymentPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          </Routes>
        </BrowserRouter>
      </GreetingProvider>
    </DarkModeProvider>
  )
}
