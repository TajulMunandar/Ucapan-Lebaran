import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-islamic flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-display text-xl font-bold text-white">
              GreetEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-primary-400 transition-colors">
              Fitur
            </a>
            <a href="#templates" className="text-gray-300 hover:text-primary-400 transition-colors">
              Template
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-primary-400 transition-colors">
              Testimoni
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-primary-400 transition-colors">
              Harga
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* CTA Button */}
            <Link to="/" className="hidden md:block btn-primary text-sm">
              Buat Ucapan
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-gray-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Fitur
              </a>
              <a 
                href="#templates" 
                className="text-gray-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Template
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimoni
              </a>
              <a 
                href="#pricing" 
                className="text-gray-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Harga
              </a>
              <Link to="/" className="btn-primary text-center mt-2">
                Buat Ucapan
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
