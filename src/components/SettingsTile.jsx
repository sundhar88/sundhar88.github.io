/**
 * SettingsTile — theme, accent, effects toggles
 */
import BentoTile from './BentoTile';

const ACCENTS = ['mono', 'yellow', 'green', 'red', 'cyan', 'blue', 'purple', 'pink'];

export default function SettingsTile({
  masterFx = true,
  onToggleMasterFx,
  theme,
  accent,
  onToggleTheme,
  onChangeAccent,
  crt,
  interlace,
  glow,
  onToggleCrt,
  onToggleInterlace,
  onToggleGlow,
}) {
  return (
    <BentoTile id="settings-tile" className="span-1">
      <div className="tile-header">system.cfg</div>
      <div className="settings-stack">
        <button
          className={`toggle-fx-btn toggle-fx ${!masterFx ? 'safe-mode-active' : ''}`}
          id="master-fx-toggle"
          onClick={onToggleMasterFx}
          aria-label="Toggle Master Animation Engine and Safe Mode"
          aria-pressed={!masterFx}
        >
          {!masterFx ? '[ /SAFE-MODE: ACTIVE (STATIC) ]' : '[ MASTER FX: ON (GSAP) ]'}
        </button>

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
            className={`effect-btn${crt && masterFx ? ' active' : ''}`}
            onClick={onToggleCrt}
            disabled={!masterFx}
            title={!masterFx ? 'Disabled in Safe Mode' : undefined}
          >
            {crt && masterFx ? '[ CRT: ON ]' : '[ CRT ]'}
          </button>
          <button
            id="interlace-toggle"
            className={`effect-btn${interlace && masterFx ? ' active' : ''}`}
            onClick={onToggleInterlace}
            disabled={!masterFx}
            title={!masterFx ? 'Disabled in Safe Mode' : undefined}
          >
            {interlace && masterFx ? '[ FX: ON ]' : '[ FX ]'}
          </button>
          <button
            id="glow-toggle"
            className={`effect-btn${glow && masterFx ? ' active' : ''}`}
            onClick={onToggleGlow}
            disabled={!masterFx}
            title={!masterFx ? 'Disabled in Safe Mode' : undefined}
          >
            {glow && masterFx ? '[ BORDER GLOW: ON ]' : '[ BORDER GLOW ]'}
          </button>
        </div>
      </div>
    </BentoTile>
  );
}
