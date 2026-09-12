import { useState, useRef, useEffect } from 'react'
import Sidebar from './Sidebar'
import SettingsModal from './SettingsModal'
import ChatMessage from './ChatMessage'
import WelcomeScreen from './WelcomeScreen'
import { loadSettings, saveSettings } from '../constants/settings'
import { buildRequestBody, streamGeminiResponse } from '../utils/gemini'
import './ChatInterface.css'

const genId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2)

const SESSIONS_KEY = 'gemini-chat-sessions'
const MOBILE_BREAKPOINT = 860

function loadSessions() {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (err) {
    console.error('Failed to load chat history:', err)
    return []
  }
}

function friendlyError(err) {
  const message = err?.message || ''
  if (message.startsWith('API key missing')) return message
  if (message.includes('API key')) return "Invalid API key. Get a new one from aistudio.google.com/app/apikey"
  if (message.includes('RESOURCE_EXHAUSTED')) return 'Rate limit exceeded. Wait a moment and try again.'
  if (message.includes('PERMISSION_DENIED')) return 'Permission denied. Check your API key or model access.'
  if (message.includes('NOT_FOUND') || message.toLowerCase().includes('not found')) {
    return 'That model is not available for your API key. Try a different one in Settings.'
  }
  return message || 'Failed to get response.'
}

export default function ChatInterface({ onLogout, theme, onToggleTheme }) {
  const [messages, setMessages] = useState([])
  const [sessions, setSessions] = useState(loadSessions)
  const [activeSessionId, setActiveSessionId] = useState(genId)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > MOBILE_BREAKPOINT)
  const [settings, setSettings] = useState(loadSettings)
  const [showSettings, setShowSettings] = useState(false)

  const messagesContainerRef = useRef(null)
  const textareaRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    // Scroll only this container's own scrollTop — never Element.scrollIntoView(),
    // which walks up and nudges every scrollable ancestor (including ones with
    // overflow: hidden, like .app-container), visibly shifting the whole layout.
    const el = messagesContainerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [input])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) setSidebarOpen(false)
  }

  const upsertSession = (id, msgs) => {
    if (msgs.length === 0) return
    const firstUser = msgs.find((m) => m.sender === 'user')
    const title = firstUser ? firstUser.text.slice(0, 42) : 'New chat'
    setSessions((prev) => {
      const others = prev.filter((s) => s.id !== id)
      const updated = [{ id, title, messages: msgs, updatedAt: Date.now() }, ...others]
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const handleNewChat = () => {
    setActiveSessionId(genId())
    setMessages([])
    setError('')
    closeSidebarOnMobile()
  }

  const handleSelectSession = (id) => {
    const session = sessions.find((s) => s.id === id)
    if (!session) return
    setActiveSessionId(id)
    setMessages(session.messages)
    setError('')
    closeSidebarOnMobile()
  }

  const handleDeleteSession = (id) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
      return updated
    })
    if (id === activeSessionId) {
      setActiveSessionId(genId())
      setMessages([])
    }
  }

  const handleRate = (messageId, rating) => {
    setMessages((prev) => {
      const updated = prev.map((msg) => (msg.id === messageId ? { ...msg, rating } : msg))
      upsertSession(activeSessionId, updated)
      return updated
    })
  }

  const performGeneration = async (baseMessages, userText, botId) => {
    setLoading(true)
    setError('')
    const controller = new AbortController()
    abortRef.current = controller

    let liveMessages = baseMessages

    try {
      const apiKey = localStorage.getItem('gemini-api-key')
      if (!apiKey) throw new Error('API key missing. Please log out and sign in again.')

      const body = buildRequestBody(userText, settings)

      const fullText = await streamGeminiResponse({
        model: settings.model,
        apiKey,
        body,
        signal: controller.signal,
        onChunk: (_chunk, fullSoFar) => {
          liveMessages = liveMessages.map((m) => (m.id === botId ? { ...m, text: fullSoFar } : m))
          setMessages(liveMessages)
        }
      })

      const finalMessages = baseMessages.map((m) =>
        m.id === botId ? { ...m, text: fullText, streaming: false } : m
      )
      setMessages(finalMessages)
      upsertSession(activeSessionId, finalMessages)
    } catch (err) {
      const aborted = err.name === 'AbortError'
      const msg = aborted ? 'Generation stopped.' : friendlyError(err)
      const finalMessages = baseMessages.map((m) =>
        m.id === botId ? { ...m, text: msg, streaming: false, isError: !aborted } : m
      )
      setMessages(finalMessages)
      if (!aborted) setError(msg)
      if (baseMessages.some((m) => m.sender === 'user')) {
        upsertSession(activeSessionId, finalMessages)
      }
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  const handleSend = async (overrideText) => {
    const text = (overrideText ?? input).trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { id: genId(), text, sender: 'user', timestamp: new Date() }
    const botId = genId()
    const botMsg = { id: botId, text: '', sender: 'bot', timestamp: new Date(), rating: null, streaming: true }
    const baseMessages = [...messages, userMsg, botMsg]
    setMessages(baseMessages)

    await performGeneration(baseMessages, text, botId)
  }

  const handleRegenerate = async (botId) => {
    if (loading) return
    const idx = messages.findIndex((m) => m.id === botId)
    if (idx === -1) return

    let userText = null
    for (let i = idx - 1; i >= 0; i--) {
      if (messages[i].sender === 'user') {
        userText = messages[i].text
        break
      }
    }
    if (userText === null) return

    const baseMessages = messages.map((m) =>
      m.id === botId ? { ...m, text: '', streaming: true, isError: false, rating: null } : m
    )
    setMessages(baseMessages)

    await performGeneration(baseMessages, userText, botId)
  }

  const handleStop = () => {
    abortRef.current?.abort()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={onToggleTheme}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onNewChat={handleNewChat}
        onLogout={onLogout}
      />

      <div className="chat-panel">
        <header className="chat-header">
          <div className="header-left">
            <button
              className="icon-btn"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <h1 className="chat-title">Gemini Chat</h1>
          </div>
          <div className="header-actions">
            <span className="model-badge">{settings.model}</span>
            <button className="icon-btn" onClick={() => setShowSettings(true)} title="Model settings">
              ⚙️
            </button>
          </div>
        </header>

        <div className="messages-container themed-scroll" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <WelcomeScreen modelName={settings.model} onSuggestion={(s) => handleSend(s)} />
          ) : (
            <div className="messages-list">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onRate={handleRate}
                  onRegenerate={handleRegenerate}
                />
              ))}
            </div>
          )}
          {error && <div className="banner-error">{error}</div>}
        </div>

        <form
          className="input-area"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <div className="input-wrapper glass">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Gemini... (Shift+Enter for a new line)"
              rows={1}
              className="message-input"
            />
            {loading ? (
              <button type="button" className="send-btn stop-btn" onClick={handleStop} title="Stop generating">
                ■
              </button>
            ) : (
              <button
                type="submit"
                className="send-btn gradient-btn"
                disabled={!input.trim()}
                title="Send message"
              >
                ➤
              </button>
            )}
          </div>
          <p className="input-hint">Gemini can make mistakes. Consider checking important information.</p>
        </form>
      </div>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSetting}
          onReset={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
