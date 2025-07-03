const STORAGE_KEY = 'calchub-history'

class HistoryService {
  constructor() {
    this.history = this.loadFromStorage()
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load history from storage:', error)
      return []
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history))
    } catch (error) {
      console.error('Failed to save history to storage:', error)
    }
  }

  getAll() {
    return [...this.history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  getById(id) {
    return this.history.find(item => item.Id === parseInt(id))
  }

  create(calculation) {
    const newCalculation = {
      ...calculation,
      Id: Math.max(...this.history.map(h => h.Id || 0)) + 1,
      timestamp: calculation.timestamp || new Date().toISOString()
    }
    
    this.history.push(newCalculation)
    this.saveToStorage()
    return newCalculation
  }

  update(id, data) {
    const index = this.history.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      this.history[index] = { ...this.history[index], ...data }
      this.saveToStorage()
      return this.history[index]
    }
    return null
  }

  delete(id) {
    const index = this.history.findIndex(item => item.Id === parseInt(id))
    if (index !== -1) {
      const deleted = this.history.splice(index, 1)[0]
      this.saveToStorage()
      return deleted
    }
    return null
  }

  clearAll() {
    this.history = []
    this.saveToStorage()
  }

  getByCalculator(calculatorId) {
    return this.history
      .filter(item => item.calculatorId === calculatorId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  getRecent(limit = 10) {
    return this.getAll().slice(0, limit)
  }

  search(query) {
    const searchTerm = query.toLowerCase()
    return this.history.filter(item => 
      item.calculatorName.toLowerCase().includes(searchTerm) ||
      JSON.stringify(item.inputs).toLowerCase().includes(searchTerm) ||
      JSON.stringify(item.results).toLowerCase().includes(searchTerm)
    )
  }
}

export const historyService = new HistoryService()