import { Link, useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const MobileNav = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: 'Home', label: 'Home' },
    { path: '/category/financial', icon: 'DollarSign', label: 'Financial' },
    { path: '/category/health', icon: 'Heart', label: 'Health' },
    { path: '/history', icon: 'History', label: 'History' },
    { path: '/settings', icon: 'Settings', label: 'Settings' }
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-glass border-t border-gray-200/50 z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default MobileNav