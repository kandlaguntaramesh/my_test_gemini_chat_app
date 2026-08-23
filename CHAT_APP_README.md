# 🤖 Gemini Chat App

A simple and elegant React chat application that integrates with Google's Gemini Flash 3.5 model for intelligent conversations.

## Features

✨ **Real-time Chat** - Chat with Google Gemini Flash 3.5 in real-time  
🔒 **Secure** - Your API key is stored locally in browser storage only  
⚡ **Fast** - Powered by the blazing-fast Gemini Flash model  
🎨 **Beautiful UI** - Modern, responsive interface with smooth animations  
📱 **Mobile Friendly** - Works great on all devices  

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Google API key for Gemini (get one free from [Google AI Studio](https://aistudio.google.com/app/apikey))

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

The app will automatically open in your default browser at `http://localhost:5173`

## Getting Your API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API key" button
3. Copy the generated API key
4. Paste it in the chat app when prompted

## How to Use

1. **Start the app** using `npm run dev`
2. **Enter your Google API key** on the login page
3. **Start chatting!** Type your message and press Enter or click the send button
4. **Logout** anytime by clicking the logout button in the header

Your API key is stored in browser local storage and never sent to our servers.

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Project Structure

```
src/
├── App.jsx                 # Main app component
├── App.css                 # Main styles
├── main.jsx               # React entry point
└── components/
    ├── ChatInterface.jsx   # Chat display & message handling
    ├── ChatInterface.css   # Chat styles
    ├── ApiKeyInput.jsx     # API key input form
    └── ApiKeyInput.css     # API key input styles
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Fast build tool
- **Google Generative AI SDK** - Gemini API integration
- **Vanilla CSS** - Styling

## Security Notes

- Your API key is stored only in your browser's local storage
- Messages are sent directly to Google's Gemini API
- No data is stored on external servers beyond Google's API
- You can clear your API key anytime by logging out

## Troubleshooting

**Issue: "Failed to get response"**
- Check that your API key is valid
- Ensure your API key has the necessary permissions
- Check your internet connection

**Issue: App not loading**
- Clear your browser cache
- Try a different browser
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)

**Issue: API key not being saved**
- Check if cookies/local storage is enabled
- Try using an incognito/private window

## License

MIT

## Support

For issues or feature requests, please create an issue in the repository.
