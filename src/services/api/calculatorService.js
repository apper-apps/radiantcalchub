import calculatorsData from '@/services/mockData/calculators.json'

class CalculatorService {
  constructor() {
    this.calculators = calculatorsData.map(calc => ({
      ...calc,
      calculate: this.createCalculateFunction(calc.Id)
    }))
  }

  createCalculateFunction(calculatorId) {
    switch (calculatorId) {
      case 'mortgage':
        return (inputs) => {
          const principal = parseFloat(inputs.principal) || 0
          const rate = parseFloat(inputs.rate) / 100 / 12 || 0
          const years = parseFloat(inputs.years) || 0
          const months = years * 12
          
          const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
          const totalPayment = monthlyPayment * months
          const totalInterest = totalPayment - principal
          
          return {
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalPayment: Math.round(totalPayment * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100
          }
        }
      
      case 'bmi':
        return (inputs) => {
          const weight = parseFloat(inputs.weight) || 0
          const height = parseFloat(inputs.height) || 0
          const unit = inputs.unit || 'metric'
          
          let bmi
          if (unit === 'imperial') {
            bmi = (weight / (height * height)) * 703
          } else {
            const heightInMeters = height / 100
            bmi = weight / (heightInMeters * heightInMeters)
          }
          
          let category = ''
          if (bmi < 18.5) category = 'Underweight'
          else if (bmi < 25) category = 'Normal'
          else if (bmi < 30) category = 'Overweight'
          else category = 'Obese'
          
          return {
            bmi: Math.round(bmi * 10) / 10,
            category: category
          }
        }
      
      case 'percentage':
        return (inputs) => {
          const value = parseFloat(inputs.value) || 0
          const percentage = parseFloat(inputs.percentage) || 0
          
          const result = (value * percentage) / 100
          const total = value + result
          
          return {
            result: Math.round(result * 100) / 100,
            total: Math.round(total * 100) / 100,
            percentageOf: Math.round((value / (parseFloat(inputs.total) || 1)) * 100 * 100) / 100
          }
        }
      
      case 'loan':
        return (inputs) => {
          const principal = parseFloat(inputs.principal) || 0
          const rate = parseFloat(inputs.rate) / 100 / 12 || 0
          const years = parseFloat(inputs.years) || 0
          const months = years * 12
          
          const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
          const totalPayment = monthlyPayment * months
          const totalInterest = totalPayment - principal
          
          return {
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalPayment: Math.round(totalPayment * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100
          }
        }
      
      case 'age':
        return (inputs) => {
          const birthDate = new Date(inputs.birthDate)
          const today = new Date()
          
          let years = today.getFullYear() - birthDate.getFullYear()
          let months = today.getMonth() - birthDate.getMonth()
          let days = today.getDate() - birthDate.getDate()
          
          if (days < 0) {
            months--
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
          }
          
          if (months < 0) {
            years--
            months += 12
          }
          
          const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24))
          const totalWeeks = Math.floor(totalDays / 7)
          const totalMonths = years * 12 + months
          
          return {
            years: years,
            months: months,
            days: days,
            totalDays: totalDays,
            totalWeeks: totalWeeks,
            totalMonths: totalMonths
          }
        }
      
      case 'scientific':
        return (inputs) => {
          const expression = inputs.expression || ''
          
          try {
            // Simple calculator - in a real app, use a proper expression parser
            const result = eval(expression.replace(/[^0-9+\-*/().\s]/g, ''))
            
            return {
              result: parseFloat(result.toFixed(10)),
              expression: expression
            }
          } catch (error) {
            return {
              result: 'Error',
              expression: expression
            }
          }
        }
      
      default:
        return (inputs) => ({
          result: 'Calculator not implemented',
          inputs: inputs
        })
    }
  }

  getAll() {
    return [...this.calculators]
  }

  getById(id) {
    return this.calculators.find(calc => calc.Id === id)
  }

  getByCategory(category) {
    return this.calculators.filter(calc => calc.category === category)
  }

  searchCalculators(query) {
    const searchTerm = query.toLowerCase()
    return this.calculators.filter(calc => 
      calc.name.toLowerCase().includes(searchTerm) ||
      calc.description.toLowerCase().includes(searchTerm) ||
      calc.category.toLowerCase().includes(searchTerm)
    )
  }

  create(calculator) {
    const newCalculator = {
      ...calculator,
      Id: Math.max(...this.calculators.map(c => parseInt(c.Id) || 0)) + 1
    }
    this.calculators.push(newCalculator)
    return newCalculator
  }

  update(id, data) {
    const index = this.calculators.findIndex(calc => calc.Id === id)
    if (index !== -1) {
      this.calculators[index] = { ...this.calculators[index], ...data }
      return this.calculators[index]
    }
    return null
  }

  delete(id) {
    const index = this.calculators.findIndex(calc => calc.Id === id)
    if (index !== -1) {
      return this.calculators.splice(index, 1)[0]
    }
    return null
  }
}

export const calculatorService = new CalculatorService()