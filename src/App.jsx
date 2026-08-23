import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ChatInterface from './components/ChatInterface'
import ApiKeyInput from './components/ApiKeyInput'
import './App.css'

export default function App() {
  // Try to get API key from environment first, then localStorage
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY
  const storedApiKey = localStorage.getItem('gemini-api-key')
  const initialApiKey = envApiKey || storedApiKey || ''
  const isInitiallyConfigured = !!initialApiKey

  const [apiKey, setApiKey] = useState(initialApiKey)
  const [isConfigured, setIsConfigured] = useState(isInitiallyConfigured)
  const [client, setClient] = useState(
    isInitiallyConfigured
      ? new GoogleGenerativeAI(initialApiKey)
      : null
  )

  const handleSetApiKey = (key) => {
    localStorage.setItem('gemini-api-key', key)
    setApiKey(key)
    setIsConfigured(true)
    try {
      const genAI = new GoogleGenerativeAI(key)
      setClient(genAI)
      console.log('✅ API key configured successfully')
    } catch (err) {
      console.error('❌ Failed to initialize API:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('gemini-api-key')
    setApiKey('')
    setIsConfigured(false)
    setClient(null)
  }

  return (
    <div className="app-container">
      {!isConfigured ? (
        <ApiKeyInput onSetApiKey={handleSetApiKey} />
      ) : (
        <ChatInterface client={client} onLogout={handleLogout} />
      )}
    </div>
  )
}
