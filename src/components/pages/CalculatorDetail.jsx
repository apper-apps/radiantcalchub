import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Chart from 'react-apexcharts'
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
  const [chartData, setChartData] = useState(null)
  const [showChart, setShowChart] = useState(false)
  const [chartType, setChartType] = useState('line')

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

const generateTimeSeriesData = (calculationResults, inputData) => {
    if (!calculator || !calculationResults) return null
    
    const { category, name } = calculator
    
    // Generate time series data based on calculator type
    if (category === 'financial') {
      if (name.toLowerCase().includes('loan') || name.toLowerCase().includes('mortgage')) {
        // Loan payment schedule
        const loanAmount = parseFloat(inputData.principal || inputData.amount || 0)
        const interestRate = parseFloat(inputData.interestRate || inputData.rate || 0) / 100 / 12
        const loanTerm = parseInt(inputData.term || inputData.years || 0) * 12
        
        if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
          const monthlyPayment = calculationResults.monthlyPayment || calculationResults.payment || 0
          const data = []
          let remainingBalance = loanAmount
          
          for (let month = 1; month <= Math.min(loanTerm, 360); month++) {
            const interestPayment = remainingBalance * interestRate
            const principalPayment = monthlyPayment - interestPayment
            remainingBalance = Math.max(0, remainingBalance - principalPayment)
            
            data.push({
              month,
              balance: remainingBalance,
              principal: principalPayment,
              interest: interestPayment,
              totalPaid: monthlyPayment * month
            })
            
            if (remainingBalance <= 0) break
          }
          
          return {
            type: 'loan',
            title: 'Loan Payment Schedule',
            data,
            series: [
              {
                name: 'Remaining Balance',
                data: data.map(d => ({ x: d.month, y: Math.round(d.balance) }))
              },
              {
                name: 'Total Paid',
                data: data.map(d => ({ x: d.month, y: Math.round(d.totalPaid) }))
              }
            ]
          }
        }
      } else if (name.toLowerCase().includes('investment') || name.toLowerCase().includes('compound')) {
        // Investment growth projection
        const principal = parseFloat(inputData.principal || inputData.initialAmount || 0)
        const monthlyContribution = parseFloat(inputData.monthlyContribution || inputData.contribution || 0)
        const annualRate = parseFloat(inputData.interestRate || inputData.rate || 0) / 100
        const years = parseInt(inputData.years || inputData.term || 0)
        
        if (principal > 0 && annualRate > 0 && years > 0) {
          const data = []
          let balance = principal
          const monthlyRate = annualRate / 12
          
          for (let month = 1; month <= years * 12; month++) {
            balance = balance * (1 + monthlyRate) + monthlyContribution
            
            if (month % 12 === 0) { // Annual data points
              data.push({
                year: month / 12,
                balance: balance,
                contributions: principal + (monthlyContribution * month),
                growth: balance - principal - (monthlyContribution * month)
              })
            }
          }
          
          return {
            type: 'investment',
            title: 'Investment Growth Projection',
            data,
            series: [
              {
                name: 'Total Value',
                data: data.map(d => ({ x: d.year, y: Math.round(d.balance) }))
              },
              {
                name: 'Contributions',
                data: data.map(d => ({ x: d.year, y: Math.round(d.contributions) }))
              },
              {
                name: 'Growth',
                data: data.map(d => ({ x: d.year, y: Math.round(d.growth) }))
              }
            ]
          }
        }
      }
    }
    
    return null
  }

  const calculateResults = async (inputData = inputs) => {
    if (!calculator) return
    
    try {
      setCalculating(true)
      
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const calculationResults = calculator.calculate(inputData)
      setResults(calculationResults)
      
      // Generate chart data for visualization
      const timeSeriesData = generateTimeSeriesData(calculationResults, inputData)
      setChartData(timeSeriesData)
      
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

  const exportChartData = () => {
    if (!chartData) return
    
    const dataStr = JSON.stringify(chartData.data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${calculator.name.replace(/\s+/g, '_')}_chart_data.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Chart data exported successfully!')
  }

  const clearForm = () => {
    const defaultInputs = {}
    calculator.fields.forEach(field => {
      defaultInputs[field.name] = field.defaultValue || ''
    })
    setInputs(defaultInputs)
    setResults({})
    setChartData(null)
    setShowChart(false)
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Results
            </h2>
            {chartData && (
              <div className="flex items-center space-x-2">
                <Button
                  variant={showChart ? "secondary" : "ghost"}
                  size="sm"
                  icon="BarChart3"
                  onClick={() => setShowChart(!showChart)}
                >
                  {showChart ? 'Table' : 'Chart'}
                </Button>
                {showChart && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Download"
                    onClick={exportChartData}
                  >
                    Export
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {Object.keys(results).length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Calculator" className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Enter values to see results</p>
            </div>
          ) : (
            <>
              {!showChart || !chartData ? (
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
              ) : (
                <div className="space-y-4">
                  {/* Chart Controls */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {chartData.title}
                    </h3>
                    <Select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                      options={[
                        { value: 'line', label: 'Line Chart' },
                        { value: 'area', label: 'Area Chart' },
                        { value: 'bar', label: 'Bar Chart' }
                      ]}
                      className="w-auto"
                    />
                  </div>
                  
                  {/* Chart */}
                  <div className="h-96">
                    <Chart
                      type={chartType}
                      height="100%"
                      series={chartData.series}
                      options={{
                        chart: {
                          type: chartType,
                          height: '100%',
                          toolbar: {
                            show: true,
                            tools: {
                              download: true,
                              selection: true,
                              zoom: true,
                              zoomin: true,
                              zoomout: true,
                              pan: true,
                              reset: true
                            }
                          },
                          animations: {
                            enabled: true,
                            easing: 'easeinout',
                            speed: 800
                          }
                        },
                        colors: ['#2563EB', '#10B981', '#F59E0B', '#EF4444'],
                        stroke: {
                          curve: 'smooth',
                          width: 2
                        },
                        fill: {
                          type: chartType === 'area' ? 'gradient' : 'solid',
                          gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.3
                          }
                        },
                        dataLabels: {
                          enabled: false
                        },
                        grid: {
                          show: true,
                          borderColor: '#E5E7EB',
                          strokeDashArray: 2
                        },
                        xaxis: {
                          title: {
                            text: chartData.type === 'loan' ? 'Months' : 'Years',
                            style: {
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#6B7280'
                            }
                          },
                          labels: {
                            style: {
                              fontSize: '12px',
                              colors: '#6B7280'
                            }
                          }
                        },
                        yaxis: {
                          title: {
                            text: 'Amount ($)',
                            style: {
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#6B7280'
                            }
                          },
                          labels: {
                            style: {
                              fontSize: '12px',
                              colors: '#6B7280'
                            },
                            formatter: (value) => '$' + value.toLocaleString()
                          }
                        },
                        legend: {
                          position: 'top',
                          horizontalAlign: 'left',
                          fontSize: '12px',
                          fontWeight: 500,
                          markers: {
                            radius: 4
                          }
                        },
                        tooltip: {
                          shared: true,
                          intersect: false,
                          y: {
                            formatter: (value) => '$' + value.toLocaleString()
                          }
                        },
                        responsive: [
                          {
                            breakpoint: 768,
                            options: {
                              chart: {
                                height: 300
                              },
                              legend: {
                                position: 'bottom'
                              }
                            }
                          }
                        ]
                      }}
                    />
                  </div>
                  
                  {/* Chart Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    {Object.entries(results).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm text-gray-500 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {typeof value === 'number' ? '$' + value.toLocaleString() : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
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