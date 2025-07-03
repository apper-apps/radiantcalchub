import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import CalculatorCard from '@/components/molecules/CalculatorCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { calculatorService } from '@/services/api/calculatorService'

const Home = () => {
  const [searchParams] = useSearchParams()
  const [calculators, setCalculators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchQuery = searchParams.get('search')

  const categories = [
    { id: 'financial', name: 'Financial', icon: 'DollarSign', color: 'from-green-400 to-blue-500' },
    { id: 'health', name: 'Health & Fitness', icon: 'Heart', color: 'from-red-400 to-pink-500' },
    { id: 'math', name: 'Math', icon: 'Calculator', color: 'from-blue-400 to-purple-500' },
    { id: 'other', name: 'Other', icon: 'Grid3x3', color: 'from-purple-400 to-indigo-500' }
  ]

  const featuredCalculators = [
    'mortgage', 'bmi', 'percentage', 'loan', 'age', 'scientific'
  ]

  const loadCalculators = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let data
      if (searchQuery) {
        data = calculatorService.searchCalculators(searchQuery)
      } else {
        data = calculatorService.getAll()
      }
      
      setCalculators(data)
    } catch (err) {
      setError(err.message || 'Failed to load calculators')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalculators()
  }, [searchQuery])

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadCalculators} />
  }

  if (searchQuery && calculators.length === 0) {
    return (
      <Empty 
        title="No calculators found"
        description={`No calculators match your search for "${searchQuery}"`}
        icon="Search"
        action={() => window.location.href = '/'}
        actionLabel="Clear Search"
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {!searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4">
            CalcHub Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Professional calculator suite with 50+ specialized tools for finance, health, math, and more
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Zap" className="w-5 h-5 text-yellow-500" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="History" className="w-5 h-5 text-blue-500" />
              <span>Calculation History</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Smartphone" className="w-5 h-5 text-green-500" />
              <span>Mobile Friendly</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
            Search Results for "{searchQuery}"
          </h2>
          <p className="text-gray-600">
            Found {calculators.length} calculator{calculators.length !== 1 ? 's' : ''}
          </p>
        </motion.div>
      )}

      {/* Categories */}
      {!searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group p-6 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 card-hover"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                <ApperIcon name={category.icon} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Featured/All Calculators */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {searchQuery ? 'Results' : 'Featured Calculators'}
          </h2>
          {!searchQuery && (
            <Link 
              to="/category/all" 
              className="text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ApperIcon name="ArrowRight" className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators
            .filter(calc => searchQuery || featuredCalculators.includes(calc.Id))
            .map((calculator, index) => (
              <motion.div
                key={calculator.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CalculatorCard 
                  calculator={calculator}
                  featured={!searchQuery && index === 0}
                />
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Quick Stats */}
      {!searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">50+</div>
            <div className="text-gray-600">Calculators</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">4</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-gray-600">Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-2">Free</div>
            <div className="text-gray-600">Forever</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Home