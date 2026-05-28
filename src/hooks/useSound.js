/**
 * useSound — manages global click sound and modal sounds
 */
import { useEffect, useRef, useCallback } from 'react';

const CLICK_FILES = [
  '/assets/click.ogg',
  '/assets/CLICK_01.wav',
  '/assets/CLICK_02.wav',
  '/assets/CLICK_03.wav',
  '/assets/CLICK_04.wav',
  '/assets/CLICK_11.wav',
  '/assets/CLICK_17.wav',
  '/assets/CLICK_18.wav',
];

export function useSound() {
  const clickSoundsRef = useRef([]);
  const openSoundRef = useRef(null);
  const closeSoundRef = useRef(null);

  useEffect(() => {
    clickSoundsRef.current = CLICK_FILES.map(file => {
      const audio = new Audio(file);
      audio.preload = 'auto';
      return audio;
    });
    openSoundRef.current = new Audio('/assets/UI_Open_Works.wav');
    closeSoundRef.current = new Audio('/assets/UI_Close_works.wav');
    openSoundRef.current.preload = 'auto';
    closeSoundRef.current.preload = 'auto';
  }, []);

  const playClick = useCallback(() => {
    const sounds = clickSoundsRef.current;
    if (!sounds.length) return;
    const idx = Math.floor(Math.random() * sounds.length);
    const s = sounds[idx];
    s.currentTime = 0;
    s.play().catch(() => {});
  }, []);

  const playOpen = useCallback(() => {
    if (openSoundRef.current) {
      openSoundRef.current.currentTime = 0;
      openSoundRef.current.play().catch(() => {});
    }
  }, []);

  const playClose = useCallback(() => {
    if (closeSoundRef.current) {
      closeSoundRef.current.currentTime = 0;
      closeSoundRef.current.play().catch(() => {});
    }
  }, []);

  // Global click sound delegation
  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest(
        'button, a, .work-card, .skill-group-header, [role="button"], .interactive, .tab-trigger'
      );
      if (!target) return;
      // Exclude work cards and modal internals (they have dedicated sounds)
      if (target.classList.contains('work-card') || target.closest('#work-modal')) return;
      playClick();
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [playClick]);

  return { playClick, playOpen, playClose };
}
