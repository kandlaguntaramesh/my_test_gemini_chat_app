# ✨ Gemini Chat

A premium, dark-glassmorphism chat interface for Google's Gemini models — built with React and Vite.

## Features

- 🌌 **Dark glassmorphism UI** — deep charcoal background, blue/purple gradient accents, translucent glass panels, with a light theme toggle
- ⚡ **Real-time streaming responses** — replies appear token-by-token, with a Stop button to cancel mid-generation
- 🗂️ **Persistent chat history** — every conversation is saved locally, titled from its first message, and can be reopened or deleted from the sidebar
- 🎛️ **Full model settings panel** — model selection, temperature, top-p, top-k, frequency/presence penalty, max output tokens, stop sequences, seed, and a system instruction, each with an inline explanation on hover
- 📝 **Markdown & code rendering** — bold/italic/links/lists render properly, and code blocks get syntax-friendly formatting with a one-click copy button
- 👍 **Per-message feedback** — thumbs up/down (mutually exclusive, changeable), copy response, and regenerate response, saved with that message
- 📱 **Responsive layout** — the sidebar collapses into an off-canvas drawer on mobile
- 🔒 **Local-only API key** — your Gemini API key is stored in your browser's local storage and sent directly to Google; it never touches any third-party server

## Prerequisites

- Node.js (v18+)
- npm
- A Google Gemini API key — get one free from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Getting Started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`), paste in your Gemini API key, and start chatting.

Alternatively, skip the key-entry screen entirely by creating a `.env.local` file in the project root:

```
VITE_GEMINI_API_KEY=your-api-key-here
```

## Building for Production

```bash
npm run build
```

Outputs an optimized build to `dist/`. Preview it locally with `npm run preview`.

## Project Structure

```
src/
├── App.jsx / App.css        # Root component, theme + auth state
├── main.jsx                 # React entry point
├── theme.css                 # Dark/light design tokens (CSS variables)
├── constants/
│   └── settings.js          # Default model settings, tooltip copy, persistence
├── utils/
│   ├── gemini.js             # Request building + streaming API calls
│   └── markdown.js           # Lightweight markdown/code-block parser
└── components/
    ├── ApiKeyInput.jsx/css   # API key entry screen
    ├── ChatInterface.jsx/css # Main chat orchestration (sessions, sending, streaming)
    ├── Sidebar.jsx/css       # Logo, new chat, history, theme toggle, logout
    ├── ChatMessage.jsx        # Message bubble: markdown, actions, feedback
    ├── CodeBlock.jsx          # Code block with copy button
    ├── WelcomeScreen.jsx      # Empty-state screen with suggestion chips
    ├── SettingsModal.jsx/css # Model settings panel
    └── InfoTooltip.jsx        # Hover explanation used throughout settings
```

## Technologies Used

- **React 18** — UI framework
- **Vite** — dev server and build tool
- **Plain CSS** (CSS variables) — no UI framework or CSS framework
- **Gemini REST API** (`streamGenerateContent`) — called directly via `fetch`, no backend

## Security Notes

- Your API key lives only in your browser's local storage
- Every request goes straight from your browser to Google's Gemini API — no proxy, no server, no third party in between
- Log out at any time to clear the stored key

## Troubleshooting

**"Invalid API key" error**
Your key was rejected by Google. Generate a fresh one at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

**"That model is not available for your API key"**
Open Settings and pick a different model — not every key has access to every model.

**Nothing happens when sending a message**
Check the browser console for the underlying error, and confirm your internet connection.

## License

MIT
