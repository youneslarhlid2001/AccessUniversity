'use client'

import { useEffect } from 'react'

interface SuccessToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export default function SuccessToast({ 
  message, 
  onClose,
  duration = 5000
}: SuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div 
      className="fixed top-20 right-4 z-50 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-lg animate-slide-down max-w-md"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center">
        <svg 
          className="w-5 h-5 mr-3 flex-shrink-0" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd" 
          />
        </svg>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-green-700 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Fermer la notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}


