/**
 * useEffects — GSAP-powered terminal effects manager with Master Animation Toggle & Safe Mode
 * Refactors CRT flicker and chromatic aberration into mathematically smooth GSAP timelines.
 * Honors prefers-reduced-motion by default and provides a clean kill/fallback mechanism.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';

function getInitialMasterFx() {
  const stored = localStorage.getItem('masterFxEnabled');
  if (stored !== null) return stored === 'true';
  // Respect prefers-reduced-motion by default
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return !prefersReduced;
}

export function useEffects() {
  const [masterFx, setMasterFx] = useState(getInitialMasterFx);
  const [crt, setCrt] = useState(() => localStorage.getItem('crtEnabled') === 'true');
  const [interlace, setInterlace] = useState(() => localStorage.getItem('interlaceEnabled') === 'true');
  const [glow, setGlow] = useState(() => localStorage.getItem('glowEnabled') === 'true');

  const crtTimelineRef = useRef(null);
  const chromaTimelineRef = useRef(null);

  // 1. Master FX / Safe Mode management
  useEffect(() => {
    localStorage.setItem('masterFxEnabled', masterFx);

    if (!masterFx) {
      // ENTER SAFE MODE / VANILLA TERMINAL:
      // Kill all active GSAP timelines and clear effects
      if (crtTimelineRef.current) {
        crtTimelineRef.current.kill();
        crtTimelineRef.current = null;
      }
      if (chromaTimelineRef.current) {
        chromaTimelineRef.current.kill();
        chromaTimelineRef.current = null;
      }

      document.body.classList.add('safe-mode');
      document.body.classList.remove('crt-enabled', 'text-interlace-enabled', 'glow-enabled');
      document.documentElement.style.removeProperty('--crt-scanline-opacity');
      document.documentElement.style.removeProperty('--chroma-shift-x');
      document.documentElement.style.removeProperty('--chroma-shift-y');
    } else {
      // EXIT SAFE MODE:
      document.body.classList.remove('safe-mode');
      document.body.classList.toggle('crt-enabled', crt);
      document.body.classList.toggle('text-interlace-enabled', interlace);
      document.body.classList.toggle('glow-enabled', glow);
    }
  }, [masterFx, crt, interlace, glow]);

  // Listen to OS prefers-reduced-motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => {
      if (e.matches) {
        setMasterFx(false);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 2. GSAP CRT Flicker Timeline
  useEffect(() => {
    if (!masterFx || !crt) {
      if (crtTimelineRef.current) {
        crtTimelineRef.current.kill();
        crtTimelineRef.current = null;
      }
      document.body.classList.remove('crt-enabled');
      return;
    }

    document.body.classList.add('crt-enabled');

    // Create a mathematically smooth micro-flicker timeline
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(document.documentElement, {
      '--crt-scanline-opacity': 0.95,
      duration: 0.1,
      ease: 'power1.inOut',
    })
      .to(document.documentElement, {
        '--crt-scanline-opacity': 1.0,
        duration: 0.18,
        ease: 'power1.out',
      })
      .to(document.documentElement, {
        '--crt-scanline-opacity': 0.97,
        duration: 2.4,
        ease: 'sine.inOut',
      })
      .to(document.documentElement, {
        '--crt-scanline-opacity': 0.93,
        duration: 0.08,
        ease: 'rough',
      })
      .to(document.documentElement, {
        '--crt-scanline-opacity': 1.0,
        duration: 1.8,
        ease: 'sine.inOut',
      });

    crtTimelineRef.current = tl;

    return () => {
      tl.kill();
      crtTimelineRef.current = null;
    };
  }, [masterFx, crt]);

  // 3. GSAP Chromatic Aberration Timeline
  useEffect(() => {
    if (!masterFx || !interlace) {
      if (chromaTimelineRef.current) {
        chromaTimelineRef.current.kill();
        chromaTimelineRef.current = null;
      }
      document.body.classList.remove('text-interlace-enabled');
      return;
    }

    document.body.classList.add('text-interlace-enabled');

    const redFe = document.getElementById('chroma-offset-red');
    const blueFe = document.getElementById('chroma-offset-blue');

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // Animate CSS custom property for text-shadow
    tl.to(document.documentElement, {
      '--chroma-shift-x': '2.2px',
      '--chroma-shift-y': '0.3px',
      duration: 1.6,
      ease: 'sine.inOut',
    }).to(document.documentElement, {
      '--chroma-shift-x': '0.9px',
      '--chroma-shift-y': '-0.2px',
      duration: 1.2,
      ease: 'power2.inOut',
    });

    // Also bind SVG filter feOffset attributes if present in DOM
    if (redFe && blueFe) {
      tl.to(redFe, { attr: { dx: 2.2, dy: 0.3 }, duration: 1.6, ease: 'sine.inOut' }, 0);
      tl.to(blueFe, { attr: { dx: -2.2, dy: -0.3 }, duration: 1.6, ease: 'sine.inOut' }, 0);
      tl.to(redFe, { attr: { dx: 0.9, dy: -0.2 }, duration: 1.2, ease: 'power2.inOut' }, 1.6);
      tl.to(blueFe, { attr: { dx: -0.9, dy: 0.2 }, duration: 1.2, ease: 'power2.inOut' }, 1.6);
    }

    chromaTimelineRef.current = tl;

    return () => {
      tl.kill();
      chromaTimelineRef.current = null;
    };
  }, [masterFx, interlace]);

  // 4. Glow toggle
  useEffect(() => {
    if (!masterFx) {
      document.body.classList.remove('glow-enabled');
      return;
    }
    document.body.classList.toggle('glow-enabled', glow);
    localStorage.setItem('glowEnabled', glow);
  }, [masterFx, glow]);

  // Toggles
  const toggleMasterFx = useCallback(() => {
    setMasterFx((prev) => !prev);
  }, []);

  const toggleCrt = useCallback(() => {
    setCrt((prev) => {
      const next = !prev;
      localStorage.setItem('crtEnabled', next);
      return next;
    });
  }, []);

  const toggleInterlace = useCallback(() => {
    setInterlace((prev) => {
      const next = !prev;
      localStorage.setItem('interlaceEnabled', next);
      return next;
    });
  }, []);

  const toggleGlow = useCallback(() => {
    setGlow((prev) => {
      const next = !prev;
      localStorage.setItem('glowEnabled', next);
      return next;
    });
  }, []);

  return {
    masterFx,
    safeMode: !masterFx,
    toggleMasterFx,
    crt,
    toggleCrt,
    interlace,
    toggleInterlace,
    glow,
    toggleGlow,
  };
}
