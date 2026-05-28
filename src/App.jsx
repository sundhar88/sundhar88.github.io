/**
 * App.jsx — Root component, wires everything together
 */
import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useEffects } from './hooks/useEffects';
import { useSound } from './hooks/useSound';

import SplashScreen from './components/SplashScreen';
import CustomCursor from './components/CustomCursor';
import HeroTile from './components/HeroTile';
import AboutTile from './components/AboutTile';
import SettingsTile from './components/SettingsTile';
import MusicTile from './components/MusicTile';
import ContactTile from './components/ContactTile';
import GlobeTile from './components/GlobeTile';
import PersonaTile from './components/PersonaTile';
import WorksTile from './components/WorksTile';
import SkillsTile from './components/SkillsTile';
import PrinciplesTile from './components/PrinciplesTile';
import SEO from './components/SEO';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  const { theme, accent, toggleTheme, changeAccent } = useTheme();
  const { crt, interlace, glow, toggleCrt, toggleInterlace, toggleGlow } = useEffects();

  // useSound registers the global click handler
  useSound();

  return (
    <>
      <SEO />
      {/* Splash Screen */}
      {!splashDone && (
        <SplashScreen onDismiss={() => setSplashDone(true)} />
      )}

      {/* CRT SVG filters */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        <defs>
          <filter id="crt-curvature">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="matrix" />
            <feComponentTransfer in="matrix" result="curvature">
              <feFuncR type="table" tableValues="0 1" />
            </feComponentTransfer>
          </filter>
          <filter id="chromatic-aberration">
            <feOffset in="SourceGraphic" dx="1.5" dy="0" result="red" />
            <feOffset in="SourceGraphic" dx="-1.5" dy="0" result="blue" />
            <feColorMatrix in="red" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redOnly" />
            <feColorMatrix in="blue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueOnly" />
            <feBlend in="redOnly" in2="blueOnly" mode="screen" result="rb" />
            <feBlend in="rb" in2="SourceGraphic" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Main layout */}
      <div className="container">
        <header className="site-header" aria-label="Site Header">
          <h1 className="sr-only">Sundhar | Senior Product Designer Portfolio</h1>
        </header>

        <main id="main" className="bento-grid">
          <HeroTile />
          <AboutTile />
          <SettingsTile
            theme={theme}
            accent={accent}
            onToggleTheme={toggleTheme}
            onChangeAccent={changeAccent}
            crt={crt}
            interlace={interlace}
            glow={glow}
            onToggleCrt={toggleCrt}
            onToggleInterlace={toggleInterlace}
            onToggleGlow={toggleGlow}
          />
          <MusicTile />
          <ContactTile />
          <PersonaTile />
          <WorksTile />
          <SkillsTile />
          <PrinciplesTile />
          <GlobeTile theme={theme} accent={accent} />
        </main>

        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Sundhar M. Built with focus on minimalist, functional design.</p>
        </footer>
      </div>

      {/* Custom cursor */}
      <CustomCursor />

      {/* Theme transition overlay */}
      <div className="theme-overlay" aria-hidden="true" />
    </>
  );
}
