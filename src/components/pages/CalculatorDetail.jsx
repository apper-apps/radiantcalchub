import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { calculatorService } from '@/services/api/calculatorService'
import { historyService } from '@/services/api/historyService'

const CalculatorDetail = () => {
  const { id } = useParams()
  const [calculator, setCalculator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inputs, setInputs] = useState({})
  const [results, setResults] = useState({})
  const [calculating, setCalculating] = useState(false)

  const loadCalculator = async () => {
    try {
      setLoading(true)
      setError(null)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const data = calculatorService.getById(id)
      if (!data) {
        throw new Error('Calculator not found')
      }
      
      setCalculator(data)
      
      // Initialize inputs with default values
      const defaultInputs = {}
      data.fields.forEach(field => {
        defaultInputs[field.name] = field.defaultValue || ''
      })
      setInputs(defaultInputs)
      
    } catch (err) {
      setError(err.message || 'Failed to load calculator')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (fieldName, value) => {
    const newInputs = { ...inputs, [fieldName]: value }
    setInputs(newInputs)
    
    // Auto-calculate if all required fields are filled
    if (calculator) {
      const requiredFields = calculator.fields.filter(f => f.required)
      const allRequiredFilled = requiredFields.every(f => newInputs[f.name] && newInputs[f.name] !== '')
      
      if (allRequiredFilled) {
        calculateResults(newInputs)
      }
    }
  }

  const calculateResults = async (inputData = inputs) => {
    if (!calculator) return
    
    try {
      setCalculating(true)
      
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const calculationResults = calculator.calculate(inputData)
      setResults(calculationResults)
      
      // Save to history
      const calculation = {
        calculatorId: calculator.Id,
        calculatorName: calculator.name,
        inputs: inputData,
        results: calculationResults,
        timestamp: new Date().toISOString()
      }
      
      historyService.create(calculation)
      
    } catch (err) {
      toast.error('Calculation failed: ' + err.message)
    } finally {
      setCalculating(false)
    }
  }

  const copyResult = (value) => {
    navigator.clipboard.writeText(value.toString())
    toast.success('Result copied to clipboard!')
  }

  const clearForm = () => {
    const defaultInputs = {}
    calculator.fields.forEach(field => {
      defaultInputs[field.name] = field.defaultValue || ''
    })
    setInputs(defaultInputs)
    setResults({})
  }

  useEffect(() => {
    loadCalculator()
  }, [id])

  if (loading) {
    return <Loading type="form" />
  }

  if (error) {
    return <Error message={error} onRetry={loadCalculator} />
  }

  if (!calculator) {
    return (
      <Error 
        message="Calculator not found" 
        onRetry={() => window.location.href = '/'}
      />
    )
  }

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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <Link to={`/category/${calculator.category}`} className="hover:text-primary transition-colors capitalize">
          {calculator.category}
        </Link>
        <ApperIcon name="ChevronRight" className="w-4 h-4" />
        <span className="text-gray-900">{calculator.name}</span>
      </nav>

      {/* Calculator Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-card p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${getCategoryColor(calculator.category)} rounded-xl flex items-center justify-center`}>
              <ApperIcon name={calculator.icon} className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                {calculator.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {calculator.description}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              icon="BookOpen"
              size="sm"
              onClick={() => toast.info('Help documentation coming soon!')}
            >
              Help
            </Button>
            <Button
              variant="ghost"
              icon="RotateCcw"
              size="sm"
              onClick={clearForm}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Tag" className="w-4 h-4" />
            <span className="capitalize">{calculator.category}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
            <span>4.8 (2.1k reviews)</span>
          </div>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Users" className="w-4 h-4" />
            <span>Used by 50k+ people</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            Input Values
          </h2>
          
          <div className="space-y-4">
            {calculator.fields.map((field) => (
              <div key={field.name}>
                {field.type === 'select' ? (
                  <Select
                    label={field.label}
                    value={inputs[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    options={field.options}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <Input
                    label={field.label}
                    type={field.type}
                    value={inputs[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    icon={field.icon}
                  />
                )}
                {field.description && (
                  <p className="text-sm text-gray-500 mt-1">{field.description}</p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex space-x-4">
            <Button
              onClick={() => calculateResults()}
              variant="primary"
              icon="Calculator"
              loading={calculating}
              className="flex-1"
            >
              Calculate
            </Button>
            <Button
              onClick={clearForm}
              variant="secondary"
              icon="RotateCcw"
            >
              Clear
            </Button>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            Results
          </h2>
          
          {Object.keys(results).length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Calculator" className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Enter values to see results</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(results).map(([key, value]) => (
                <div key={key} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Copy"
                      onClick={() => copyResult(value)}
                    />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Usage Instructions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-card p-8"
      >
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          How to Use
        </h2>
        <div className="prose prose-gray max-w-none">
          <ol className="space-y-2">
            <li>Fill in the required input fields on the left</li>
            <li>Values will automatically calculate as you type</li>
            <li>Click "Calculate" for manual calculation</li>
            <li>Copy results to clipboard using the copy button</li>
            <li>Use "Clear" to reset all values</li>
          </ol>
        </div>
      </motion.div>
    </div>
  )
}

export default CalculatorDetail