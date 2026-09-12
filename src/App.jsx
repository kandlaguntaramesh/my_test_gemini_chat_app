import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import ApiKeyInput from './components/ApiKeyInput'
import './App.css'

export default function App() {
  // Try to get API key from environment first, then localStorage
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY
  const storedApiKey = localStorage.getItem('gemini-api-key')
  const initialApiKey = envApiKey || storedApiKey || ''
  const isInitiallyConfigured = !!initialApiKey

  const [isConfigured, setIsConfigured] = useState(isInitiallyConfigured)
  const [theme, setTheme] = useState(() => localStorage.getItem('gemini-theme') || 'dark')

  useEffect(() => {
    // The rest of the app reads the key from localStorage, so an
    // env-provided key must be mirrored there or every send fails.
    if (envApiKey && !storedApiKey) {
      localStorage.setItem('gemini-api-key', envApiKey)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('gemini-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleSetApiKey = (key) => {
    localStorage.setItem('gemini-api-key', key)
    setIsConfigured(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('gemini-api-key')
    setIsConfigured(false)
  }

  return (
    <div className={`app-container ${!isConfigured ? 'centered' : ''}`}>
      <div className="bg-orb blue" />
      <div className="bg-orb purple" />

      {!isConfigured ? (
        <ApiKeyInput onSetApiKey={handleSetApiKey} />
      ) : (
        <ChatInterface onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
      )}
    </div>
  )
}
