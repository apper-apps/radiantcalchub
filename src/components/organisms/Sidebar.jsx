import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const categories = [
  { 
    id: 'financial', 
    name: 'Financial', 
    icon: 'DollarSign', 
    count: 15,
    color: 'text-green-600 bg-green-50'
  },
  { 
    id: 'health', 
    name: 'Health & Fitness', 
    icon: 'Heart', 
    count: 12,
    color: 'text-red-600 bg-red-50'
  },
  { 
    id: 'math', 
    name: 'Math', 
    icon: 'Calculator', 
    count: 18,
    color: 'text-blue-600 bg-blue-50'
  },
  { 
    id: 'other', 
    name: 'Other', 
    icon: 'Grid3x3', 
    count: 24,
    color: 'text-purple-600 bg-purple-50'
  }
]

const Sidebar = () => {
  const location = useLocation()

  return (
    <div className="h-[calc(100vh-4rem)] bg-white/50 backdrop-blur-sm border-r border-gray-200/50 p-6">
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const isActive = location.pathname === `/category/${category.id}`
              
              return (
                <Link
                  key={category.id}
                  to={`/category/${category.id}`}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-white/20' : category.color
                    }`}>
                      <ApperIcon 
                        name={category.icon} 
                        className={`w-4 h-4 ${isActive ? 'text-white' : category.color.split(' ')[0]}`} 
                      />
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                  }`}>
                    {category.count}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Access */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Quick Access
          </h3>
          <div className="space-y-2">
            <Link
              to="/calculator/mortgage"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Home" className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                Mortgage Calculator
              </span>
            </Link>
            <Link
              to="/calculator/bmi"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Heart" className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                BMI Calculator
              </span>
            </Link>
            <Link
              to="/calculator/percentage"
              className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Percent" className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                Percentage Calculator
              </span>
            </Link>
          </div>
        </div>

        {/* Recent Calculations */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Recent
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Mortgage</span>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="font-semibold text-gray-900">$2,847/month</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">BMI</span>
                <span className="text-xs text-gray-400">5 min ago</span>
              </div>
              <div className="font-semibold text-gray-900">23.4 (Normal)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar