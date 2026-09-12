import InfoTooltip from './InfoTooltip'
import { AVAILABLE_MODELS, SETTING_INFO, DEFAULT_SETTINGS } from '../constants/settings'
import './SettingsModal.css'

export default function SettingsModal({ settings, onUpdate, onReset, onClose }) {
  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel glass" onClick={(e) => e.stopPropagation()}>
        <div className="settings-panel-header">
          <div>
            <h2>Model Settings</h2>
            <p className="settings-subtitle">Fine-tune how Gemini responds</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">✕</button>
        </div>

        <div className="settings-body themed-scroll">
          <div className="setting-group">
            <label htmlFor="model-select">
              <span className="label-text">Model <InfoTooltip text={SETTING_INFO.model} /></span>
            </label>
            <select
              id="model-select"
              value={settings.model}
              onChange={(e) => onUpdate('model', e.target.value)}
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <label htmlFor="temperature">
              <span className="label-text">Temperature <InfoTooltip text={SETTING_INFO.temperature} /></span>
              <span className="setting-value">{settings.temperature}</span>
            </label>
            <input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => onUpdate('temperature', parseFloat(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="topP">
              <span className="label-text">Top P <InfoTooltip text={SETTING_INFO.topP} /></span>
              <span className="setting-value">{settings.topP}</span>
            </label>
            <input
              id="topP"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.topP}
              onChange={(e) => onUpdate('topP', parseFloat(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="topK">
              <span className="label-text">Top K <InfoTooltip text={SETTING_INFO.topK} /></span>
              <span className="setting-value">{settings.topK}</span>
            </label>
            <input
              id="topK"
              type="range"
              min="1"
              max="100"
              step="1"
              value={settings.topK}
              onChange={(e) => onUpdate('topK', parseInt(e.target.value, 10))}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="frequencyPenalty">
              <span className="label-text">Frequency Penalty <InfoTooltip text={SETTING_INFO.frequencyPenalty} /></span>
              <span className="setting-value">{settings.frequencyPenalty}</span>
            </label>
            <input
              id="frequencyPenalty"
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={settings.frequencyPenalty}
              onChange={(e) => onUpdate('frequencyPenalty', parseFloat(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="presencePenalty">
              <span className="label-text">Presence Penalty <InfoTooltip text={SETTING_INFO.presencePenalty} /></span>
              <span className="setting-value">{settings.presencePenalty}</span>
            </label>
            <input
              id="presencePenalty"
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={settings.presencePenalty}
              onChange={(e) => onUpdate('presencePenalty', parseFloat(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="maxOutputTokens">
              <span className="label-text">Max output tokens <InfoTooltip text={SETTING_INFO.maxOutputTokens} /></span>
            </label>
            <input
              id="maxOutputTokens"
              type="number"
              min="1"
              max="8192"
              value={settings.maxOutputTokens}
              onChange={(e) => onUpdate('maxOutputTokens', parseInt(e.target.value, 10) || 1)}
            />
          </div>

          <div className="setting-group full-width">
            <label htmlFor="stopSequences">
              <span className="label-text">Stop Sequences <InfoTooltip text={SETTING_INFO.stopSequences} /></span>
            </label>
            <input
              id="stopSequences"
              type="text"
              placeholder="e.g. END, ###"
              value={settings.stopSequences}
              onChange={(e) => onUpdate('stopSequences', e.target.value)}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="seed">
              <span className="label-text">Seed <InfoTooltip text={SETTING_INFO.seed} /></span>
            </label>
            <input
              id="seed"
              type="number"
              placeholder="Random"
              value={settings.seed}
              onChange={(e) => onUpdate('seed', e.target.value)}
            />
          </div>

          <div className="setting-group full-width">
            <label htmlFor="systemInstruction">
              <span className="label-text">System instruction <InfoTooltip text={SETTING_INFO.systemInstruction} /></span>
            </label>
            <textarea
              id="systemInstruction"
              rows="3"
              placeholder="e.g. You are a concise, friendly assistant."
              value={settings.systemInstruction}
              onChange={(e) => onUpdate('systemInstruction', e.target.value)}
            />
          </div>
        </div>

        <div className="settings-footer">
          <button className="reset-btn" onClick={() => onReset(DEFAULT_SETTINGS)}>
            Reset to defaults
          </button>
          <button className="done-btn gradient-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
