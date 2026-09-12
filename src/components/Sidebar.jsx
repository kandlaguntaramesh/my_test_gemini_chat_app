import './Sidebar.css'

function formatTimestamp(ts) {
  if (!ts) return ''
  const date = new Date(ts)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }

  const isThisYear = date.getFullYear() === now.getFullYear()
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: isThisYear ? undefined : 'numeric'
  })
}

export default function Sidebar({
  open,
  onClose,
  theme,
  onToggleTheme,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  onLogout
}) {
  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar glass ${open ? 'open' : 'closed'}`}>
        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-logo">✨</div>
            <span className="brand-name">Gemini Chat</span>
          </div>
          <button className="icon-btn mobile-only" onClick={onClose} aria-label="Close sidebar">✕</button>
        </div>

        <button className="new-chat-btn gradient-btn" onClick={onNewChat}>
          <span className="plus-icon">+</span> New Chat
        </button>

        <div className="history-section themed-scroll">
          <h3>Chat History</h3>
          {sessions.length === 0 ? (
            <p className="no-history">No conversations yet</p>
          ) : (
            <ul className="history-list">
              {sessions.map((s) => (
                <li key={s.id} className={`history-item ${s.id === activeSessionId ? 'active' : ''}`}>
                  <button className="history-item-btn" onClick={() => onSelectSession(s.id)}>
                    <span className="history-dot" />
                    <span className="history-text">
                      <span className="history-title">{s.title}</span>
                      <span className="history-timestamp">{formatTimestamp(s.updatedAt)}</span>
                    </span>
                  </button>
                  <button
                    className="history-delete"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(s.id)
                    }}
                    title="Delete conversation"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="sidebar-footer">
          <button className="footer-btn" onClick={onToggleTheme}>
            {theme === 'dark' ? '☀️  Light mode' : '🌙  Dark mode'}
          </button>
          <button className="footer-btn logout" onClick={onLogout}>
            🚪  Logout
          </button>
        </div>
      </aside>
    </>
  )
}
