import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CalculatorCard from '@/components/molecules/CalculatorCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { calculatorService } from '@/services/api/calculatorService'

const CategoryView = () => {
  const { category } = useParams()
  const [calculators, setCalculators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categoryInfo = {
    'financial': {
      name: 'Financial Calculators',
      icon: 'DollarSign',
      color: 'from-green-400 to-blue-500',
      description: 'Calculate loans, mortgages, investments, and more'
    },
    'health': {
      name: 'Health & Fitness',
      icon: 'Heart',
      color: 'from-red-400 to-pink-500',
      description: 'BMI, calorie, body fat, and fitness calculators'
    },
    'math': {
      name: 'Math Calculators',
      icon: 'Calculator',
      color: 'from-blue-400 to-purple-500',
      description: 'Scientific, algebra, geometry, and statistical tools'
    },
    'other': {
      name: 'Other Calculators',
      icon: 'Grid3x3',
      color: 'from-purple-400 to-indigo-500',
      description: 'Unit converters, date calculations, and more'
    }
  }

  const loadCalculators = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const data = calculatorService.getByCategory(category)
      setCalculators(data)
    } catch (err) {
      setError(err.message || 'Failed to load calculators')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCalculators()
  }, [category])

  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <Error message={error} onRetry={loadCalculators} />
  }

  if (calculators.length === 0) {
    return (
      <Empty 
        title="No calculators found"
        description={`No calculators available in the ${categoryInfo[category]?.name || category} category`}
        icon="Calculator"
        action={() => window.location.href = '/'}
        actionLabel="Browse All Categories"
      />
    )
  }

  const info = categoryInfo[category] || {
    name: 'Calculators',
    icon: 'Calculator',
    color: 'from-gray-400 to-gray-500',
    description: 'Professional calculation tools'
  }

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className={`w-20 h-20 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          <ApperIcon name={info.icon} className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          {info.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          {info.description}
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Calculator" className="w-4 h-4" />
            <span>{calculators.length} calculators</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Zap" className="w-4 h-4" />
            <span>Instant results</span>
          </div>
        </div>
      </motion.div>

      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-gray-900">{info.name}</span>
      </nav>

      {/* Calculators Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {calculators.map((calculator, index) => (
          <motion.div
            key={calculator.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CalculatorCard calculator={calculator} />
          </motion.div>
        ))}
      </motion.div>

      {/* Category Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-card p-8 mt-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold gradient-text mb-2">
              {calculators.length}
            </div>
            <div className="text-gray-600">Total Calculators</div>
          </div>
          <div>
            <div className="text-2xl font-bold gradient-text mb-2">
              {calculators.filter(c => c.popular).length || Math.floor(calculators.length * 0.3)}
            </div>
            <div className="text-gray-600">Popular Tools</div>
          </div>
          <div>
            <div className="text-2xl font-bold gradient-text mb-2">
              4.8
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold gradient-text mb-2">
              Free
            </div>
            <div className="text-gray-600">Always Free</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CategoryView