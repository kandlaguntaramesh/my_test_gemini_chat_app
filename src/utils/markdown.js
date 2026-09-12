export function splitCodeBlocks(text) {
  const parts = []
  const regex = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', lang: match[1] || 'text', content: match[2].replace(/\n$/, '') })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', content: text })
  }

  return parts
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineFormat(text) {
  let html = escapeHtml(text)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  return html
}

export function markdownToHtml(text) {
  const blocks = text.split(/\n{2,}/).filter(Boolean)

  return blocks
    .map((block) => {
      const lines = block.split('\n')
      const isList = lines.length > 0 && lines.every((l) => /^\s*[-*]\s+/.test(l))

      if (isList) {
        const items = lines
          .map((l) => `<li>${inlineFormat(l.replace(/^\s*[-*]\s+/, ''))}</li>`)
          .join('')
        return `<ul>${items}</ul>`
      }

      return `<p>${inlineFormat(block).replace(/\n/g, '<br/>')}</p>`
    })
    .join('')
}
