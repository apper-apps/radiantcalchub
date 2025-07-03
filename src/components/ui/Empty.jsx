import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = 'No data found', 
  description = 'Get started by creating your first item',
  icon = 'Search',
  action,
  actionLabel = 'Get Started',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-white" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {description}
      </p>
      
      {action && (
        <Button 
          onClick={action}
          variant="primary"
          icon="Plus"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty