import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 text-white hover:from-primary/90 hover:to-primary/80 focus:ring-primary/20 shadow-sm hover:shadow-md",
    secondary: "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/20",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-200",
    success: "bg-gradient-to-r from-success to-success/90 text-white hover:from-success/90 hover:to-success/80 focus:ring-success/20",
    danger: "bg-gradient-to-r from-error to-error/90 text-white hover:from-error/90 hover:to-error/80 focus:ring-error/20"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }
  
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6"
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon name={icon} className={`${iconSizes[size]} mr-2`} />
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <ApperIcon name={icon} className={`${iconSizes[size]} ml-2`} />
          )}
        </>
      )}
    </motion.button>
  )
}

export default Button