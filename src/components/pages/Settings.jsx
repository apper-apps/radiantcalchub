import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'

const Settings = () => {
  const [settings, setSettings] = useState({
    decimalPlaces: 2,
    thousandsSeparator: true,
    defaultCurrency: 'USD',
    theme: 'light',
    autoCalculate: true,
    saveHistory: true,
    exportFormat: 'json'
  })

  const [loading, setLoading] = useState(false)

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('calchub-settings')
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) })
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      localStorage.setItem('calchub-settings', JSON.stringify(settings))
      toast.success('Settings saved successfully!')
    } catch (err) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        decimalPlaces: 2,
        thousandsSeparator: true,
        defaultCurrency: 'USD',
        theme: 'light',
        autoCalculate: true,
        saveHistory: true,
        exportFormat: 'json'
      }
      setSettings(defaultSettings)
      localStorage.removeItem('calchub-settings')
      toast.success('Settings reset to default')
    }
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This will remove calculation history and settings.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const settingsSections = [
    {
      title: 'Display Settings',
      icon: 'Monitor',
      settings: [
        {
          key: 'decimalPlaces',
          label: 'Decimal Places',
          type: 'select',
          options: [
            { value: 0, label: '0 decimal places' },
            { value: 1, label: '1 decimal place' },
            { value: 2, label: '2 decimal places' },
            { value: 3, label: '3 decimal places' },
            { value: 4, label: '4 decimal places' }
          ]
        },
        {
          key: 'thousandsSeparator',
          label: 'Use Thousands Separator',
          type: 'checkbox',
          description: 'Show commas in large numbers (e.g., 1,000,000)'
        },
        {
          key: 'defaultCurrency',
          label: 'Default Currency',
          type: 'select',
          options: [
            { value: 'USD', label: 'US Dollar (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' },
            { value: 'GBP', label: 'British Pound (GBP)' },
            { value: 'JPY', label: 'Japanese Yen (JPY)' },
            { value: 'CAD', label: 'Canadian Dollar (CAD)' }
          ]
        }
      ]
    },
    {
      title: 'Calculation Settings',
      icon: 'Calculator',
      settings: [
        {
          key: 'autoCalculate',
          label: 'Auto Calculate',
          type: 'checkbox',
          description: 'Calculate results automatically as you type'
        },
        {
          key: 'saveHistory',
          label: 'Save Calculation History',
          type: 'checkbox',
          description: 'Keep a record of all calculations'
        }
      ]
    },
    {
      title: 'Export Settings',
      icon: 'Download',
      settings: [
        {
          key: 'exportFormat',
          label: 'Export Format',
          type: 'select',
          options: [
            { value: 'json', label: 'JSON' },
            { value: 'csv', label: 'CSV' },
            { value: 'pdf', label: 'PDF' }
          ]
        }
      ]
    }
  ]

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
              Settings
            </h1>
            <p className="text-gray-600">
              Customize your CalcHub Pro experience
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={resetSettings}
              variant="secondary"
              icon="RotateCcw"
              size="sm"
            >
              Reset to Default
            </Button>
            <Button
              onClick={saveSettings}
              variant="primary"
              icon="Save"
              size="sm"
              loading={loading}
            >
              Save Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              {localStorage.getItem('calchub-history') ? 
                JSON.parse(localStorage.getItem('calchub-history')).length : 0}
            </div>
            <div className="text-sm text-gray-600">Calculations</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-gray-600">Calculators</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">
              {Math.round(localStorage.length * 1.5)}KB
            </div>
            <div className="text-sm text-gray-600">Data Used</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary mb-1">v1.0</div>
            <div className="text-sm text-gray-600">Version</div>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.1 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name={section.icon} className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-display font-semibold text-gray-900">
              {section.title}
            </h2>
          </div>

          <div className="space-y-6">
            {section.settings.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {setting.label}
                  </label>
                  {setting.description && (
                    <p className="text-sm text-gray-500">{setting.description}</p>
                  )}
                </div>
                <div className="ml-6">
                  {setting.type === 'select' ? (
                    <Select
                      value={settings[setting.key]}
                      onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      options={setting.options}
                      className="w-48"
                    />
                  ) : setting.type === 'checkbox' ? (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings[setting.key]}
                        onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {settings[setting.key] ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  ) : (
                    <Input
                      type={setting.type}
                      value={settings[setting.key]}
                      onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      className="w-48"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-red-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Database" className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-display font-semibold text-gray-900">
            Data Management
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <h3 className="font-medium text-red-900">Clear All Data</h3>
              <p className="text-sm text-red-700">
                This will remove all calculation history, settings, and preferences
              </p>
            </div>
            <Button
              onClick={clearAllData}
              variant="danger"
              icon="Trash2"
              size="sm"
            >
              Clear All
            </Button>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Info" className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-display font-semibold text-gray-900">
            About CalcHub Pro
          </h2>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <p>
            CalcHub Pro is a comprehensive calculator suite designed to provide professional-grade calculation tools for finance, health, math, and more.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong className="text-gray-900">Version:</strong> 1.0.0
            </div>
            <div>
              <strong className="text-gray-900">Build:</strong> 2024.01.15
            </div>
            <div>
              <strong className="text-gray-900">Calculators:</strong> 50+
            </div>
            <div>
              <strong className="text-gray-900">Categories:</strong> 4
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings