import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import ApperIcon from '@/components/ApperIcon'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (query) => {
    navigate(`/?search=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-glass border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Calculator" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold gradient-text">
                CalcHub Pro
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Professional Calculator Suite</p>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/history"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
            >
              <ApperIcon name="History" className="w-5 h-5" />
              <span className="font-medium">History</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
            >
              <ApperIcon name="Settings" className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/history"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ApperIcon name="History" className="w-5 h-5" />
              <span>History</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ApperIcon name="Settings" className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default Header