import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { generateStandardizedFields, detectOrganization, calculateCompletionScore } from './utils/dataEngine'

function App() {
  const [csvData, setCsvData] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [indicators, setIndicators] = useState([])
  const [currentIndicator, setCurrentIndicator] = useState(0)
  const [responses, setResponses] = useState({})
  const [isComplete, setIsComplete] = useState(false)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    console.log('File selected:', file.name)

    Papa.parse(file, {
      complete: (results) => {
        console.log('CSV parse complete:', results)
        
        if (results.errors && results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors)
          alert('Error parsing CSV file: ' + results.errors[0].message)
          return
        }

        if (!results.data || results.data.length === 0) {
          alert('CSV file appears to be empty or invalid')
          return
        }

        console.log('CSV data:', results.data)
        setCsvData(results.data)
        
        try {
          const detectedOrg = detectOrganization(results.data)
          console.log('Detected organization:', detectedOrg)
          setOrganization(detectedOrg)
          
          const standardizedIndicators = generateStandardizedFields(results.data)
          console.log('Generated indicators:', standardizedIndicators)
          setIndicators(standardizedIndicators)
          setCurrentIndicator(0)
          setResponses({})
          setIsComplete(false)
        } catch (error) {
          console.error('Error processing CSV:', error)
          alert('Error processing CSV file: ' + error.message)
        }
      },
      error: (error) => {
        console.error('Papa Parse error:', error)
        alert('Error reading CSV file: ' + error.message)
      },
      header: true,
      skipEmptyLines: true
    })
  }

  const handleFieldChange = (fieldId, value) => {
    const newResponses = { ...responses, [fieldId]: value }
    setResponses(newResponses)
    
    const completionScore = calculateCompletionScore(indicators, newResponses)
    if (completionScore.percentage === 100) {
      setIsComplete(true)
    }
  }

  const nextIndicator = () => {
    if (currentIndicator < indicators.length - 1) {
      setCurrentIndicator(currentIndicator + 1)
    }
  }

  const prevIndicator = () => {
    if (currentIndicator > 0) {
      setCurrentIndicator(currentIndicator - 1)
    }
  }

  const generateReport = () => {
    const reportData = {
      organization: organization?.name || 'Unknown Organization',
      submissionDate: new Date().toISOString(),
      indicators: indicators.map(indicator => ({
        ...indicator,
        responses: indicator.fields.map(field => ({
          ...field,
          value: responses[field.id] || null
        }))
      })),
      completionScore: calculateCompletionScore(indicators, responses)
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${organization?.code || 'report'}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  if (!csvData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              YWC Reporting Portal v2
            </h1>
            <p className="text-lg text-gray-600">
              Automated, standardized reporting for nonprofit organizations
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Your Workplan CSV
              </h2>
              <p className="text-gray-600 mb-6">
                Import your indicators from the YWC Workplan Builder to begin automated reporting
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="btn-primary cursor-pointer inline-block"
              >
                Choose CSV File
              </label>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">What makes this different?</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Automated field generation - no more manual form creation
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Standardized data collection for cross-organization comparisons
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Intelligent organization detection and pre-filled profiles
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const currentIndicatorData = indicators[currentIndicator]
  const completionScore = calculateCompletionScore(indicators, responses)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                YWC Reporting Portal
              </h1>
              <p className="text-gray-600">
                {organization?.name || 'Organization'} • {indicators.length} indicators
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(completionScore.percentage)}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionScore.percentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>{completionScore.completed} of {completionScore.total} fields completed</span>
            {isComplete && (
              <button onClick={generateReport} className="btn-primary text-sm">
                Generate Report
              </button>
            )}
          </div>
        </div>

        {/* Current Indicator */}
        {currentIndicatorData && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentIndicatorData.title}
                </h2>
                <p className="text-gray-600 mt-1">
                  Indicator {currentIndicator + 1} of {indicators.length}
                </p>
              </div>
              <span className={`badge badge-${currentIndicatorData.tier}`}>
                Tier {currentIndicatorData.tier}
              </span>
            </div>

            {currentIndicatorData.description && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700">{currentIndicatorData.description}</p>
              </div>
            )}

            {/* Fields */}
            <div className="space-y-6">
              {currentIndicatorData.fields.map((field) => (
                <div key={field.id} className="form-group">
                  <label className="form-label">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {field.description && (
                    <p className="text-sm text-gray-600 mt-1 mb-3">{field.description}</p>
                  )}

                  {field.type === 'number' && (
                    <input
                      type="number"
                      className="form-input"
                      value={responses[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}

                  {field.type === 'currency' && (
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        className="form-input pl-8"
                        value={responses[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  {field.type === 'percentage' && (
                    <div className="relative">
                      <input
                        type="number"
                        className="form-input pr-8"
                        value={responses[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-3 text-gray-500">%</span>
                    </div>
                  )}

                  {field.type === 'radio' && (
                    <div className="space-y-2">
                      {field.options.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name={field.id}
                            value={option.value}
                            checked={responses[field.id] === option.value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="form-radio text-blue-600"
                          />
                          <span className="ml-2">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'scale' && (
                    <div className="space-y-2">
                      {field.options.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name={field.id}
                            value={option.value}
                            checked={responses[field.id] === option.value}
                            onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
                            className="form-radio text-blue-600"
                          />
                          <span className="ml-2">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'calculated' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-lg font-semibold text-blue-900">
                        {responses[field.id] || 'Calculating...'}
                        {field.unit && ` ${field.unit}`}
                      </div>
                      <p className="text-sm text-blue-700 mt-1">
                        Automatically calculated based on your inputs
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevIndicator}
                disabled={currentIndicator === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              <div className="text-sm text-gray-500">
                {currentIndicator + 1} / {indicators.length}
              </div>
              
              <button
                onClick={nextIndicator}
                disabled={currentIndicator === indicators.length - 1}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App