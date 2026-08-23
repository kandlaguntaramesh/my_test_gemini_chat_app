import { useState, useRef, useEffect } from 'react'
import './ChatInterface.css'

export default function ChatInterface({ client, onLogout }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      rating: null
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [modelName, setModelName] = useState('gemini-3.6-flash')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)

  const handleRating = (messageId, rating) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, rating } : msg
      )
    )
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const findBestModel = async () => {
      try {
        console.log('🔍 Finding best available model...')
        const modelList = await client.listModels()

        const availableModels = []
        for await (const model of modelList.models) {
          const modelName = model.name.replace('models/', '')
          availableModels.push(modelName)
          console.log('Found model:', modelName)

          if (model.supportedGenerationMethods?.includes('generateContent')) {
            console.log('✅ Model supports generateContent:', modelName)
            if (modelName.includes('flash') || modelName.includes('pro')) {
              setModelName(modelName)
              console.log('✅ Using model:', modelName)
              return
            }
          }
        }

        console.log('📋 Available models:', availableModels)
      } catch (err) {
        console.error('Failed to list models:', err)
        console.log('Using default model: gemini-pro')
      }
    }

    if (client) {
      findBestModel()
    }
  }, [client])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    try {
      console.log('🔄 Step 1: Starting message send...')
      console.log('🔄 Client object exists:', !!client)

      if (!client) {
        throw new Error('Client not initialized. Please refresh and try again.')
      }

      console.log('🔄 Step 2: Sending to REST API...')

      const apiKey = localStorage.getItem('gemini-api-key')
      const modelsToTry = ['gemini-3.6-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro', 'gemini-1.5-pro', 'gemini-pro-vision']

      let response
      let data
      let successModel = null

      for (let model of modelsToTry) {
        try {
          console.log(`Trying model: ${model}`)
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: input
                      }
                    ]
                  }
                ]
              })
            }
          )

          if (response.ok) {
            data = await response.json()
            successModel = model
            console.log(`✅ Success with model: ${model}`)
            setModelName(model)
            break
          } else {
            const errorData = await response.json()
            console.log(`❌ Model ${model} failed:`, errorData.error?.message)
          }
        } catch (err) {
          console.log(`❌ Error trying ${model}:`, err.message)
        }
      }

      if (!successModel) {
        throw new Error('No available models found. Your API key may not have access to Gemini models.')
      }

      console.log('✅ Step 3: Got response from ' + successModel)
      console.log('Response:', data)

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) {
        throw new Error('Invalid response format from API')
      }
      console.log('✅ Step 4: Extracted text successfully')

      const botMessage = {
        id: messages.length + 2,
        text: text,
        sender: 'bot',
        timestamp: new Date(),
        rating: null
      }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error('❌ ERROR OCCURRED')
      console.error('Error:', err)

      let errorMsg = 'Failed to get response.'

      if (err.message?.includes('No available models')) {
        errorMsg = '❌ Your API key doesn\'t have access to Gemini. Visit https://aistudio.google.com/app/apikey to enable it.'
      } else if (err.message?.includes('API key')) {
        errorMsg = '❌ Invalid API key. Get a new one from aistudio.google.com/app/apikey'
      } else if (err.message?.includes('RESOURCE_EXHAUSTED')) {
        errorMsg = '❌ Rate limit exceeded. Wait a moment and try again.'
      } else if (err.message?.includes('PERMISSION_DENIED')) {
        errorMsg = '❌ Permission denied. Check your API key.'
      } else {
        errorMsg = '❌ ' + (err.message || 'Unknown error')
      }

      setError(errorMsg)
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: errorMsg,
          sender: 'bot',
          timestamp: new Date()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-wrapper">
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <button className="new-chat-btn" onClick={() => setMessages([{
            id: 1,
            text: 'How can I help you today?',
            sender: 'bot',
            timestamp: new Date(),
            rating: null
          }])}>
            ➕ New Chat
          </button>
        </div>
        <div className="sidebar-content">
          <h3>Recent Chats</h3>
          <p className="no-chats">No previous chats</p>
        </div>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>🚪 Logout</button>
        </div>
      </aside>

      <div className="chat-container">
        <div className="chat-header">
          <h1>Gemini Chat</h1>
          <span className="model-info">{modelName}</span>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message-wrapper ${message.sender}`}>
              <div className="message-bubble">
                <div className="message-text">{message.text}</div>
                {message.sender === 'bot' && (
                  <div className="message-actions">
                    <button
                      className={`action-btn ${message.rating === 'up' ? 'active' : ''}`}
                      onClick={() => handleRating(message.id, message.rating === 'up' ? null : 'up')}
                      title="Helpful"
                    >
                      👍
                    </button>
                    <button
                      className={`action-btn ${message.rating === 'down' ? 'active' : ''}`}
                      onClick={() => handleRating(message.id, message.rating === 'down' ? null : 'down')}
                      title="Not helpful"
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-wrapper bot">
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="input-area">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Gemini..."
              disabled={loading}
              className="message-input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="send-btn"
            >
              {loading ? '⌛' : '⬆️'}
            </button>
          </div>
          <p className="input-hint">Gemini can make mistakes. Consider checking important information.</p>
        </form>
      </div>
    </div>
  )
}
