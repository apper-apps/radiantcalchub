import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CalculatorCard = ({ calculator, featured = false }) => {
  const getCategoryColor = (category) => {
    const colors = {
      'financial': 'from-green-400 to-blue-500',
      'health': 'from-red-400 to-pink-500',
      'math': 'from-blue-400 to-purple-500',
      'other': 'from-purple-400 to-indigo-500'
    }
    return colors[category] || colors['other']
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`group ${featured ? 'lg:col-span-2' : ''}`}
    >
      <Link to={`/calculator/${calculator.Id}`}>
        <div className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden ${
          featured ? 'p-8' : 'p-6'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(calculator.category)} rounded-xl flex items-center justify-center ${
              featured ? 'w-16 h-16' : ''
            }`}>
              <ApperIcon 
                name={calculator.icon} 
                className={`text-white ${featured ? 'w-8 h-8' : 'w-6 h-6'}`} 
              />
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-500">4.8</span>
            </div>
          </div>
          
          <h3 className={`font-display font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors ${
            featured ? 'text-xl' : 'text-lg'
          }`}>
            {calculator.name}
          </h3>
          
          <p className={`text-gray-600 mb-4 ${featured ? 'text-base' : 'text-sm'}`}>
            {calculator.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
              {calculator.category}
            </span>
            
            <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Calculate</span>
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CalculatorCard