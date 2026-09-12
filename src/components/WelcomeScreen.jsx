const SUGGESTIONS = [
  'Explain quantum computing simply',
  'Write a short poem about the ocean',
  'Help me debug a JavaScript function',
  'Plan a 3-day trip to Tokyo'
]

export default function WelcomeScreen({ onSuggestion, modelName }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-icon">
        <span>✨</span>
      </div>
      <h1 className="welcome-title">How can I help you today?</h1>
      <p className="welcome-subtitle">
        Ask me anything — I'm powered by <span className="welcome-model">{modelName}</span>
      </p>

      <div className="suggestion-grid">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="suggestion-chip glass" onClick={() => onSuggestion(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
