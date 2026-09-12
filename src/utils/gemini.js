export function buildGenerationConfig(settings) {
  const config = {
    temperature: settings.temperature,
    maxOutputTokens: settings.maxOutputTokens,
    topP: settings.topP,
    topK: settings.topK,
    frequencyPenalty: settings.frequencyPenalty,
    presencePenalty: settings.presencePenalty
  }

  const stopSequences = settings.stopSequences
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (stopSequences.length) {
    config.stopSequences = stopSequences
  }

  if (settings.seed !== '' && !Number.isNaN(Number(settings.seed))) {
    config.seed = parseInt(settings.seed, 10)
  }

  return config
}

export function buildRequestBody(userText, settings) {
  const body = {
    contents: [
      {
        parts: [{ text: userText }]
      }
    ],
    generationConfig: buildGenerationConfig(settings)
  }

  if (settings.systemInstruction.trim()) {
    body.systemInstruction = {
      parts: [{ text: settings.systemInstruction.trim() }]
    }
  }

  return body
}

/**
 * Streams a Gemini generateContent response via SSE and reports incremental
 * text through onChunk(chunkText, fullTextSoFar). Resolves with the full text.
 */
export async function streamGeminiResponse({ model, apiKey, body, onChunk, signal }) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal
    }
  )

  if (!res.ok || !res.body) {
    let message = `Request failed (${res.status})`
    try {
      const errJson = await res.json()
      message = errJson.error?.message || message
    } catch {
      // ignore parse failure, keep default message
    }
    throw new Error(message)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue

      const jsonStr = trimmed.slice(5).trim()
      if (!jsonStr || jsonStr === '[DONE]') continue

      try {
        const parsed = JSON.parse(jsonStr)
        const blockReason = parsed.promptFeedback?.blockReason
        if (blockReason) {
          throw new Error(`Prompt blocked: ${blockReason}`)
        }
        const textChunk = (parsed.candidates?.[0]?.content?.parts || [])
          .map((p) => p.text || '')
          .join('')
        if (textChunk) {
          fullText += textChunk
          onChunk(textChunk, fullText)
        }
      } catch (err) {
        if (err.message?.startsWith('Prompt blocked')) throw err
        console.error('Failed to parse stream chunk:', err, jsonStr)
      }
    }
  }

  if (!fullText) {
    throw new Error('Empty response from model. It may not support streaming or your API key may lack access.')
  }

  return fullText
}
