/**
 * useEffects — manages CRT, interlace, glow toggles
 */
import { useState, useEffect, useCallback } from 'react';

export function useEffects() {
  const [crt, setCrt] = useState(() => localStorage.getItem('crtEnabled') === 'true');
  const [interlace, setInterlace] = useState(() => localStorage.getItem('interlaceEnabled') === 'true');
  const [glow, setGlow] = useState(() => localStorage.getItem('glowEnabled') === 'true');

  useEffect(() => {
    document.body.classList.toggle('crt-enabled', crt);
    localStorage.setItem('crtEnabled', crt);
  }, [crt]);

  useEffect(() => {
    document.body.classList.toggle('text-interlace-enabled', interlace);
    localStorage.setItem('interlaceEnabled', interlace);
  }, [interlace]);

  useEffect(() => {
    document.body.classList.toggle('glow-enabled', glow);
    localStorage.setItem('glowEnabled', glow);
  }, [glow]);

  return {
    crt, toggleCrt: useCallback(() => setCrt(v => !v), []),
    interlace, toggleInterlace: useCallback(() => setInterlace(v => !v), []),
    glow, toggleGlow: useCallback(() => setGlow(v => !v), []),
  };
}
