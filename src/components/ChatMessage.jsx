import { useState } from 'react'
import CodeBlock from './CodeBlock'
import { splitCodeBlocks, markdownToHtml } from '../utils/markdown'

export default function ChatMessage({ message, onRate, onRegenerate }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.sender === 'user'
  const parts = isUser ? null : splitCodeBlocks(message.text)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      <div className={`avatar ${isUser ? 'avatar-user' : 'avatar-bot'}`}>
        {isUser ? '🧑' : '✨'}
      </div>

      <div className="message-col">
        <div className={`message-bubble glass ${isUser ? 'user' : 'bot'} ${message.isError ? 'is-error' : ''}`}>
          {isUser ? (
            <div className="msg-text">{message.text}</div>
          ) : (
            <>
              {parts.map((part, i) =>
                part.type === 'code' ? (
                  <CodeBlock key={i} lang={part.lang} code={part.content} />
                ) : (
                  <div
                    key={i}
                    className="msg-text"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(part.content) }}
                  />
                )
              )}
              {message.streaming && <span className="stream-cursor" />}
            </>
          )}
        </div>

        {!isUser && !message.streaming && (
          <div className="message-actions">
            <button className="action-btn" onClick={handleCopy} title="Copy response">
              {copied ? '✓' : '⧉'}
            </button>
            <button className="action-btn" onClick={() => onRegenerate(message.id)} title="Regenerate response">
              ↻
            </button>
            <button
              className={`action-btn thumb-up ${message.rating === 'up' ? 'active' : ''}`}
              onClick={() => onRate(message.id, message.rating === 'up' ? null : 'up')}
              title={message.rating === 'up' ? 'Marked helpful' : 'Mark as helpful'}
              aria-pressed={message.rating === 'up'}
            >
              👍
            </button>
            <button
              className={`action-btn thumb-down ${message.rating === 'down' ? 'active' : ''}`}
              onClick={() => onRate(message.id, message.rating === 'down' ? null : 'down')}
              title={message.rating === 'down' ? 'Marked not helpful' : 'Mark as not helpful'}
              aria-pressed={message.rating === 'down'}
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
