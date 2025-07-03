import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { calculatorService } from '@/services/api/calculatorService'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    if (query.length > 0) {
      const searchResults = calculatorService.searchCalculators(query)
      setResults(searchResults)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query])

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    setRecentSearches(recent)
  }, [])

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
      
      // Add to recent searches
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
      const updated = [searchQuery, ...recent.filter(s => s !== searchQuery)].slice(0, 5)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      setRecentSearches(updated)
      
      setQuery('')
      setIsOpen(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          placeholder="Search calculators..."
          className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-card-hover border border-gray-200 overflow-hidden z-50"
          >
            {results.length > 0 ? (
              <div className="max-h-64 overflow-y-auto">
                {results.map((calc) => (
                  <button
                    key={calc.Id}
                    onClick={() => handleSearch(calc.name)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                        <ApperIcon name={calc.icon} className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{calc.name}</div>
                        <div className="text-sm text-gray-500">{calc.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length > 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                No calculators found
              </div>
            ) : recentSearches.length > 0 ? (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{search}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar