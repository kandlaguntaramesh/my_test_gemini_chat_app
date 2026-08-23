import { useState } from 'react'
import './ApiKeyInput.css'

export default function ApiKeyInput({ onSetApiKey }) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!apiKey.trim()) {
      setError('Please enter a valid API key')
      return
    }
    setError('')
    onSetApiKey(apiKey.trim())
  }

  return (
    <div className="api-key-container">
      <div className="card">
        <div className="card-header">
          <h1>🤖 Gemini Chat</h1>
          <p>Google Generative AI Chat App</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="apiKey">API Key</label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Google Gemini API key"
              className="input"
            />
            <p className="helper-text">
              Get your API key from{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </a>
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="button button-primary">
            Start Chatting
          </button>
        </form>

        <div className="info-section">
          <h3>About</h3>
          <p>This app uses Google's Gemini Flash 3.5 model for fast and intelligent conversations.</p>
          <ul>
            <li>💬 Real-time chat with Gemini</li>
            <li>🔒 Your API key is stored locally only</li>
            <li>⚡ Powered by Gemini Flash 3.5</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
