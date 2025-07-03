import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { historyService } from '@/services/api/historyService'
import { format } from 'date-fns'

const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const data = historyService.getAll()
      setHistory(data)
    } catch (err) {
      setError(err.message || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all calculation history?')) {
      try {
        historyService.clearAll()
        setHistory([])
        toast.success('History cleared successfully')
      } catch (err) {
        toast.error('Failed to clear history')
      }
    }
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `calchub-history-${format(new Date(), 'yyyy-MM-dd')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('History exported successfully')
  }

  const deleteCalculation = (id) => {
    if (window.confirm('Are you sure you want to delete this calculation?')) {
      try {
        historyService.delete(id)
        setHistory(history.filter(h => h.Id !== id))
        toast.success('Calculation deleted')
      } catch (err) {
        toast.error('Failed to delete calculation')
      }
    }
  }

  const getCalculatorIcon = (calculatorId) => {
    const iconMap = {
      'mortgage': 'Home',
      'bmi': 'Heart',
      'percentage': 'Percent',
      'loan': 'DollarSign',
      'age': 'Calendar',
      'scientific': 'Calculator'
    }
    return iconMap[calculatorId] || 'Calculator'
  }

  useEffect(() => {
    loadHistory()
  }, [])

  if (loading) {
    return <Loading type="list" />
  }

  if (error) {
    return <Error message={error} onRetry={loadHistory} />
  }

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true
    if (filter === 'today') {
      const today = new Date()
      const itemDate = new Date(item.timestamp)
      return itemDate.toDateString() === today.toDateString()
    }
    if (filter === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(item.timestamp) >= weekAgo
    }
    return true
  })

  if (filteredHistory.length === 0) {
    return (
      <Empty 
        title="No calculation history"
        description="Start using calculators to build your calculation history"
        icon="History"
        action={() => window.location.href = '/'}
        actionLabel="Start Calculating"
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
              Calculation History
            </h1>
            <p className="text-gray-600">
              View and manage your calculation history
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={exportHistory}
              variant="secondary"
              icon="Download"
              size="sm"
            >
              Export
            </Button>
            <Button
              onClick={clearHistory}
              variant="danger"
              icon="Trash2"
              size="sm"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex items-center space-x-2">
            {[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === option.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="ml-auto text-sm text-gray-500">
            {filteredHistory.length} calculation{filteredHistory.length !== 1 ? 's' : ''}
          </div>
        </div>
      </motion.div>

      {/* History List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {filteredHistory.map((item, index) => (
          <motion.div
            key={item.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <ApperIcon 
                    name={getCalculatorIcon(item.calculatorId)} 
                    className="w-6 h-6 text-white" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-display font-semibold text-gray-900">
                      {item.calculatorName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  
                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Inputs</h4>
                      <div className="space-y-1">
                        {Object.entries(item.inputs).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-gray-900 font-medium">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Results */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Results</h4>
                      <div className="space-y-1">
                        {Object.entries(item.results).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-gray-900 font-semibold">
                              {typeof value === 'number' ? value.toLocaleString() : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Link to={`/calculator/${item.calculatorId}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="ExternalLink"
                  >
                    Recalculate
                  </Button>
                </Link>
                <Button
                  onClick={() => deleteCalculation(item.Id)}
                  variant="ghost"
                  size="sm"
                  icon="Trash2"
                  className="text-red-600 hover:text-red-700"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default History