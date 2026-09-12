export const AVAILABLE_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-pro-vision'
]

export const DEFAULT_SETTINGS = {
  model: 'gemini-3.6-flash',
  temperature: 1,
  maxOutputTokens: 2048,
  topP: 0.95,
  topK: 40,
  frequencyPenalty: 0,
  presencePenalty: 0,
  stopSequences: '',
  seed: '',
  systemInstruction: ''
}

export const SETTING_INFO = {
  model: 'Which Gemini model handles your request. Different models trade off speed, quality, and capability.',
  temperature: 'Controls randomness. Lower values make responses more focused and deterministic; higher values make them more creative and varied.',
  topP: 'Nucleus sampling: only tokens whose cumulative probability adds up to this value are considered. Lower values keep output more focused.',
  topK: 'Only the top K most likely next tokens are considered at each step. Lower values keep output more focused.',
  maxOutputTokens: 'The maximum number of tokens the model is allowed to generate in its response.',
  frequencyPenalty: 'Penalizes tokens based on how often they already appear in the response so far, reducing repetition. Higher values discourage repeated words more strongly.',
  presencePenalty: 'Penalizes tokens that have appeared at all so far, encouraging the model to introduce new topics. Higher values push it toward novelty.',
  stopSequences: 'Text sequences that immediately stop generation if produced. Separate multiple sequences with commas.',
  seed: 'A fixed number that makes generation reproducible — the same seed and inputs tend to produce the same output. Leave blank for random results.',
  systemInstruction: "Instructions that set the model's persona, tone, or behavior for the whole conversation, applied before your messages."
}

const STORAGE_KEY = 'gemini-model-settings'

export const loadSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch (err) {
    console.error('Failed to load model settings:', err)
  }
  return DEFAULT_SETTINGS
}

export const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
