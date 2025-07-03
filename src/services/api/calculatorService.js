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
case 'compound-interest':
        return (inputs) => {
          const principal = parseFloat(inputs.principal) || 0
          const rate = parseFloat(inputs.rate) / 100 || 0
          const years = parseFloat(inputs.years) || 0
          
          const compoundInterest = principal * Math.pow(1 + rate, years)
          const totalInterest = compoundInterest - principal
          
          return {
            finalAmount: Math.round(compoundInterest * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100,
            principal: principal
          }
        }
      
      case 'amortization':
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
            totalInterest: Math.round(totalInterest * 100) / 100,
            principalPaid: principal,
            interestPaid: Math.round(totalInterest * 100) / 100
          }
        }
      
      case 'mortgage-payoff':
        return (inputs) => {
          const principal = parseFloat(inputs.principal) || 0
          const rate = parseFloat(inputs.rate) / 100 / 12 || 0
          const years = parseFloat(inputs.years) || 0
          const extraPayment = parseFloat(inputs.extraPayment) || 0
          const months = years * 12
          
          const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
          const totalPayment = monthlyPayment * months
          
          // Calculate with extra payment
          let balance = principal
          let totalPaid = 0
          let monthsWithExtra = 0
          
          while (balance > 0.01 && monthsWithExtra < months) {
            const interestPayment = balance * rate
            const principalPayment = Math.min(monthlyPayment + extraPayment - interestPayment, balance)
            balance -= principalPayment
            totalPaid += interestPayment + principalPayment
            monthsWithExtra++
          }
          
          const timeSaved = months - monthsWithExtra
          const interestSaved = totalPayment - totalPaid
          
          return {
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            newPayment: Math.round((monthlyPayment + extraPayment) * 100) / 100,
            timeSaved: Math.round(timeSaved),
            interestSaved: Math.round(interestSaved * 100) / 100,
            totalSavings: Math.round(interestSaved * 100) / 100
          }
        }
      
      case 'house-affordability':
        return (inputs) => {
          const income = parseFloat(inputs.income) || 0
          const monthlyDebts = parseFloat(inputs.monthlyDebts) || 0
          const downPayment = parseFloat(inputs.downPayment) || 0
          const rate = parseFloat(inputs.rate) / 100 / 12 || 0
          
          const monthlyIncome = income / 12
          const maxHousingPayment = monthlyIncome * 0.28 // 28% rule
          const maxTotalDebt = monthlyIncome * 0.36 // 36% rule
          const maxPayment = Math.min(maxHousingPayment, maxTotalDebt - monthlyDebts)
          
          // Calculate affordable home price (30-year mortgage)
          const months = 30 * 12
          const maxLoanAmount = maxPayment * (Math.pow(1 + rate, months) - 1) / (rate * Math.pow(1 + rate, months))
          const maxHomePrice = maxLoanAmount + downPayment
          
          return {
            maxHomePrice: Math.round(maxHomePrice * 100) / 100,
            maxLoanAmount: Math.round(maxLoanAmount * 100) / 100,
            maxMonthlyPayment: Math.round(maxPayment * 100) / 100,
            downPayment: downPayment,
            monthlyIncome: Math.round(monthlyIncome * 100) / 100
          }
        }
      
      case 'rent-calculator':
        return (inputs) => {
          const income = parseFloat(inputs.income) || 0
          const expenses = parseFloat(inputs.expenses) || 0
          const savingsRate = parseFloat(inputs.savings) / 100 || 0
          
          const desiredSavings = income * savingsRate
          const availableForRent = income - expenses - desiredSavings
          const recommendedRent = income * 0.3 // 30% rule
          
          return {
            maxAffordableRent: Math.round(availableForRent * 100) / 100,
            recommendedRent: Math.round(recommendedRent * 100) / 100,
            savingsAmount: Math.round(desiredSavings * 100) / 100,
            remainingIncome: Math.round((income - expenses - recommendedRent - desiredSavings) * 100) / 100,
            rentToIncomeRatio: Math.round((recommendedRent / income) * 100 * 100) / 100
          }
        }
      
      case 'debt-to-income':
        return (inputs) => {
          const monthlyIncome = parseFloat(inputs.monthlyIncome) || 0
          const mortgagePayment = parseFloat(inputs.mortgagePayment) || 0
          const otherDebts = parseFloat(inputs.otherDebts) || 0
          
          const totalDebts = mortgagePayment + otherDebts
          const frontEndRatio = (mortgagePayment / monthlyIncome) * 100
          const backEndRatio = (totalDebts / monthlyIncome) * 100
          
          let qualification = 'Good'
          if (backEndRatio > 43) qualification = 'Poor'
          else if (backEndRatio > 36) qualification = 'Fair'
          else if (backEndRatio > 28) qualification = 'Good'
          else qualification = 'Excellent'
          
          return {
            frontEndRatio: Math.round(frontEndRatio * 100) / 100,
            backEndRatio: Math.round(backEndRatio * 100) / 100,
            qualification: qualification,
            totalDebts: Math.round(totalDebts * 100) / 100,
            availableIncome: Math.round((monthlyIncome - totalDebts) * 100) / 100
          }
        }
      
      case 'real-estate':
        return (inputs) => {
          const purchasePrice = parseFloat(inputs.purchasePrice) || 0
          const downPayment = parseFloat(inputs.downPayment) || 0
          const monthlyRent = parseFloat(inputs.monthlyRent) || 0
          const expenses = parseFloat(inputs.expenses) || 0
          const rate = parseFloat(inputs.rate) / 100 / 12 || 0
          
          const loanAmount = purchasePrice - downPayment
          const months = 30 * 12
          const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
          
          const monthlyCashFlow = monthlyRent - monthlyPayment - expenses
          const annualCashFlow = monthlyCashFlow * 12
          const cashOnCashReturn = (annualCashFlow / downPayment) * 100
          const capRate = ((monthlyRent * 12 - expenses * 12) / purchasePrice) * 100
          
          return {
            monthlyCashFlow: Math.round(monthlyCashFlow * 100) / 100,
            annualCashFlow: Math.round(annualCashFlow * 100) / 100,
            cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
            capRate: Math.round(capRate * 100) / 100,
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalInvestment: Math.round(downPayment * 100) / 100
          }
        }
      
      case 'refinance':
        return (inputs) => {
          const currentBalance = parseFloat(inputs.currentBalance) || 0
          const currentRate = parseFloat(inputs.currentRate) / 100 / 12 || 0
          const newRate = parseFloat(inputs.newRate) / 100 / 12 || 0
          const remainingYears = parseFloat(inputs.remainingYears) || 0
          const closingCosts = parseFloat(inputs.closingCosts) || 0
          
          const months = remainingYears * 12
          
          const currentPayment = currentBalance * (currentRate * Math.pow(1 + currentRate, months)) / (Math.pow(1 + currentRate, months) - 1)
          const newPayment = currentBalance * (newRate * Math.pow(1 + newRate, months)) / (Math.pow(1 + newRate, months) - 1)
          
          const monthlySavings = currentPayment - newPayment
          const totalSavings = monthlySavings * months - closingCosts
          const breakEvenMonths = closingCosts / monthlySavings
          
          return {
            currentPayment: Math.round(currentPayment * 100) / 100,
            newPayment: Math.round(newPayment * 100) / 100,
            monthlySavings: Math.round(monthlySavings * 100) / 100,
            totalSavings: Math.round(totalSavings * 100) / 100,
            breakEvenMonths: Math.round(breakEvenMonths * 100) / 100,
            closingCosts: closingCosts
          }
        }
      
      case 'rental-property':
        return (inputs) => {
          const propertyPrice = parseFloat(inputs.propertyPrice) || 0
          const downPaymentPercent = parseFloat(inputs.downPayment) / 100 || 0
          const monthlyRent = parseFloat(inputs.monthlyRent) || 0
          const monthlyExpenses = parseFloat(inputs.monthlyExpenses) || 0
          const rate = parseFloat(inputs.rate) / 100 / 12 || 0
          
          const downPayment = propertyPrice * downPaymentPercent
          const loanAmount = propertyPrice - downPayment
          const months = 30 * 12
          const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
          
          const netOperatingIncome = monthlyRent - monthlyExpenses
          const cashFlow = netOperatingIncome - monthlyPayment
          const cashOnCashReturn = (cashFlow * 12 / downPayment) * 100
          const capRate = (netOperatingIncome * 12 / propertyPrice) * 100
          const onePercentRule = (monthlyRent / propertyPrice) * 100
          
          return {
            monthlyRent: monthlyRent,
            monthlyExpenses: monthlyExpenses,
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            cashFlow: Math.round(cashFlow * 100) / 100,
            cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
            capRate: Math.round(capRate * 100) / 100,
            onePercentRule: Math.round(onePercentRule * 100) / 100,
            downPayment: Math.round(downPayment * 100) / 100
          }
        }
      
      case 'apr-calculator':
        return (inputs) => {
          const loanAmount = parseFloat(inputs.loanAmount) || 0
          const interestRate = parseFloat(inputs.interestRate) / 100 || 0
          const loanTerm = parseFloat(inputs.loanTerm) || 0
          const fees = parseFloat(inputs.fees) || 0
          
          const monthlyRate = interestRate / 12
          const months = loanTerm * 12
          const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
          
          // Calculate APR by finding the rate that makes the present value of payments equal to loan amount minus fees
          const netLoanAmount = loanAmount - fees
          const totalPayments = monthlyPayment * months
          
          // Approximation formula for APR
          const aprRate = (((totalPayments / netLoanAmount) - 1) / loanTerm) * 100
          
          return {
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalPayments: Math.round(totalPayments * 100) / 100,
            totalInterest: Math.round((totalPayments - loanAmount) * 100) / 100,
            apr: Math.round(aprRate * 100) / 100,
            fees: fees,
            effectiveLoanAmount: Math.round(netLoanAmount * 100) / 100
          }
        }
      
      case 'calorie':
        return (inputs) => {
          const weight = parseFloat(inputs.weight) || 0
          const height = parseFloat(inputs.height) || 0
          const age = parseFloat(inputs.age) || 0
          const gender = inputs.gender || 'male'
          
          // Harris-Benedict Equation
          let bmr
          if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
          } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
          }
          
          const sedentary = bmr * 1.2
          const lightlyActive = bmr * 1.375
          const moderatelyActive = bmr * 1.55
          const veryActive = bmr * 1.725
          
          return {
            bmr: Math.round(bmr),
            sedentary: Math.round(sedentary),
            lightlyActive: Math.round(lightlyActive),
            moderatelyActive: Math.round(moderatelyActive),
            veryActive: Math.round(veryActive)
          }
        }
      
      case 'currency':
        return (inputs) => {
          const amount = parseFloat(inputs.amount) || 0
          const fromCurrency = inputs.fromCurrency || 'USD'
          const toCurrency = inputs.toCurrency || 'EUR'
          
          // Mock exchange rates - in real app, fetch from API
          const exchangeRates = {
            'USD': { 'EUR': 0.85, 'GBP': 0.75, 'JPY': 110 },
            'EUR': { 'USD': 1.18, 'GBP': 0.88, 'JPY': 129 },
            'GBP': { 'USD': 1.33, 'EUR': 1.14, 'JPY': 147 },
            'JPY': { 'USD': 0.009, 'EUR': 0.0078, 'GBP': 0.0068 }
          }
          
          let convertedAmount = amount
          if (fromCurrency !== toCurrency) {
            const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1
            convertedAmount = amount * rate
          }
          
          return {
            originalAmount: amount,
            convertedAmount: Math.round(convertedAmount * 100) / 100,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            exchangeRate: Math.round((convertedAmount / amount) * 10000) / 10000
          }
        }
      
      case 'unit-converter':
        return (inputs) => {
          const value = parseFloat(inputs.value) || 0
          const fromUnit = inputs.fromUnit || 'meters'
          const toUnit = inputs.toUnit || 'feet'
          
          // Conversion factors to meters
          const conversionFactors = {
            'meters': 1,
            'feet': 0.3048,
            'kilometers': 1000,
            'miles': 1609.34
          }
          
          const valueInMeters = value * conversionFactors[fromUnit]
          const convertedValue = valueInMeters / conversionFactors[toUnit]
          
          return {
            originalValue: value,
            convertedValue: Math.round(convertedValue * 100) / 100,
            fromUnit: fromUnit,
            toUnit: toUnit
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