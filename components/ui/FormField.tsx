'use client'

import { useState, useEffect } from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  error?: string
  placeholder?: string
  required?: boolean
  validation?: (value: string) => string | null
  helpText?: string
  maxLength?: number
  rows?: number
  options?: { value: string; label: string }[]
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  validation,
  helpText,
  maxLength,
  rows = 4,
  options
}: FormFieldProps) {
  const [touched, setTouched] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (touched && validation) {
      const validationError = validation(value)
      setLocalError(validationError || null)
      setIsValid(validationError === null)
    }
  }, [value, touched, validation])

  const handleBlur = () => {
    setTouched(true)
    if (validation) {
      const validationError = validation(value)
      setLocalError(validationError || null)
      setIsValid(validationError === null)
    }
  }

  const displayError = error || localError
  const showError = touched && displayError

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
    ${showError 
      ? 'border-red-500 focus:border-red-600 focus:ring-red-500' 
      : isValid === true
      ? 'border-green-500 focus:border-green-600 focus:ring-green-500'
      : 'border-gray-200 focus:border-blue-600 focus:ring-blue-500'
    }
    focus:outline-none focus:ring-2
  `

  return (
    <div className="space-y-2">
      <label 
        htmlFor={name}
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          rows={rows}
          className={inputClasses}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${name}-error` : helpText ? `${name}-help` : undefined}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          required={required}
          className={inputClasses}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${name}-error` : helpText ? `${name}-help` : undefined}
        >
          <option value="">Sélectionnez une option</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            maxLength={maxLength}
            className={inputClasses}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? `${name}-error` : helpText ? `${name}-help` : undefined}
          />
          {isValid === true && touched && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      )}

      {maxLength && (
        <div className="text-xs text-gray-500 text-right">
          {value.length}/{maxLength} caractères
        </div>
      )}

      {helpText && !showError && (
        <p id={`${name}-help`} className="text-xs text-gray-500">
          {helpText}
        </p>
      )}

      {showError && (
        <p 
          id={`${name}-error`} 
          className="text-sm text-red-600 flex items-center"
          role="alert"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {displayError}
        </p>
      )}
    </div>
  )
}


