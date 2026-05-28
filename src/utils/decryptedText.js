/**
 * DecryptedText utility — port of the vanilla JS decrypted-text.js
 */
import { useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`';

/**
 * Animates an element's text content with a decrypt effect.
 * @param {HTMLElement} el
 * @param {Object} opts
 */
export function applyDecryptedText(el, opts = {}) {
  const {
    speed = 5,
    maxIterations = 10,
    sequential = false,
    revealDirection = 'start',
    encryptedClassName = 'decrypted-encrypted',
  } = opts;

  const originalText = el.textContent;
  if (!originalText.trim()) return;

  let iteration = 0;
  let revealedCount = 0;
  let animId;

  function getChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  function step() {
    let result = '';
    const total = originalText.length;

    if (sequential) {
      // Reveal characters one by one
      for (let i = 0; i < total; i++) {
        if (originalText[i] === ' ' || originalText[i] === '\n') {
          result += originalText[i];
        } else if (i < revealedCount) {
          result += originalText[i];
        } else {
          result += getChar();
        }
      }
      iteration++;
      if (iteration % Math.max(1, Math.floor(speed / 2)) === 0) {
        revealedCount++;
      }
      if (revealedCount >= total) {
        el.textContent = originalText;
        return;
      }
    } else {
      // All chars scramble together
      for (let i = 0; i < total; i++) {
        if (originalText[i] === ' ' || originalText[i] === '\n') {
          result += originalText[i];
        } else if (iteration / speed > (i / total)) {
          result += originalText[i];
        } else {
          result += getChar();
        }
      }
      iteration++;
      if (iteration >= maxIterations * speed) {
        el.textContent = originalText;
        return;
      }
    }

    el.textContent = result;
    animId = requestAnimationFrame(step);
  }

  cancelAnimationFrame(animId);
  animId = requestAnimationFrame(step);
}

/**
 * React hook to apply decrypt animation on mount
 */
export function useDecryptedText(ref, opts = {}) {
  useEffect(() => {
    if (ref.current && window.innerWidth >= 768) {
      applyDecryptedText(ref.current, opts);
    }
  }, []); // eslint-disable-line
}
