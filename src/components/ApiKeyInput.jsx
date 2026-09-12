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
      <div className="card glass">
        <div className="card-header">
          <div className="card-logo">✨</div>
          <h1>Gemini Chat</h1>
          <p>Your premium AI assistant, powered by Google Gemini</p>
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

          <button type="submit" className="button button-primary gradient-btn">
            Start Chatting
          </button>
        </form>

        <div className="info-section glass">
          <h3>About</h3>
          <p>A premium chat interface for Google's Gemini models.</p>
          <ul>
            <li>💬 Real-time streaming responses</li>
            <li>🔒 Your API key is stored locally only</li>
            <li>⚙️ Fully customizable model settings</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
