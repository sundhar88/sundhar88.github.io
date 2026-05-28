/**
 * SettingsTile — theme, accent, effects toggles
 */
import BentoTile from './BentoTile';

const ACCENTS = ['mono', 'yellow', 'green', 'red', 'cyan', 'blue', 'purple', 'pink'];

export default function SettingsTile({ theme, accent, onToggleTheme, onChangeAccent, crt, interlace, glow, onToggleCrt, onToggleInterlace, onToggleGlow }) {
  return (
    <BentoTile id="settings-tile" className="span-1">
      <div className="tile-header">system.cfg</div>
      <div className="settings-stack">
        <button
          className="theme-toggle-btn"
          id="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-pressed={theme === 'light'}
        >
          [ TOGGLE THEME ]
        </button>

        <div className="accent-switcher-row" aria-label="Accent color">
          {ACCENTS.map(color => (
            <button
              key={color}
              className={`accent-btn${accent === color ? ' active' : ''}`}
              data-color={color}
              onClick={() => onChangeAccent(color)}
              aria-pressed={accent === color}
              aria-label={color}
              title={color}
            />
          ))}
        </div>

        <div className="effects-stack">
          <button
            id="crt-toggle"
            className={`effect-btn${crt ? ' active' : ''}`}
            onClick={onToggleCrt}
          >
            {crt ? '[ CRT: ON ]' : '[ CRT ]'}
          </button>
          <button
            id="interlace-toggle"
            className={`effect-btn${interlace ? ' active' : ''}`}
            onClick={onToggleInterlace}
          >
            {interlace ? '[ FX: ON ]' : '[ FX ]'}
          </button>
          <button
            id="glow-toggle"
            className={`effect-btn${glow ? ' active' : ''}`}
            onClick={onToggleGlow}
          >
            {glow ? '[ BORDER GLOW: ON ]' : '[ BORDER GLOW ]'}
          </button>
        </div>
      </div>
    </BentoTile>
  );
}
