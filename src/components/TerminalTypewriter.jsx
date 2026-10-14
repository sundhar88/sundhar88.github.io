/**
 * TerminalTypewriter — GSAP-powered terminal typewriter with cursor state
 * Cursor stays solid while typing, then transitions to retro step-blink when idle.
 * Respects safe-mode / prefers-reduced-motion by rendering immediately.
 */
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export default function TerminalTypewriter({
  text = '',
  speed = 0.035, // seconds per character
  delay = 0,
  cursor = true,
  cursorChar = '█',
  className = '',
  onComplete,
  as: Component = 'span',
}) {
  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Check reduced motion or safe-mode
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSafeMode = document.body.classList.contains('safe-mode');

    if (isReducedMotion || isSafeMode) {
      el.textContent = text;
      setIsTyping(false);
      if (onComplete) onComplete();
      return;
    }

    // Reset element
    el.textContent = '';
    setIsTyping(true);

    const tween = gsap.to(el, {
      text: { value: text, delimiter: '' },
      duration: Math.max(text.length * speed, 0.4),
      delay,
      ease: 'none',
      onComplete: () => {
        setIsTyping(false);
        if (onComplete) onComplete();
      },
    });

    return () => {
      tween.kill();
    };
  }, [text, speed, delay, onComplete]);

  // Cursor animation
  useEffect(() => {
    const cur = cursorRef.current;
    if (!cur || !cursor) return;

    const isSafeMode = document.body.classList.contains('safe-mode');
    if (isSafeMode) {
      cur.style.opacity = '1';
      return;
    }

    let cursorTween;
    if (isTyping) {
      // Solid cursor during active typing
      gsap.killTweensOf(cur);
      cur.style.opacity = '1';
    } else {
      // Blinking cursor when idle
      cursorTween = gsap.to(cur, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.53,
        ease: 'steps(1)',
      });
    }

    return () => {
      if (cursorTween) cursorTween.kill();
    };
  }, [isTyping, cursor]);

  return (
    <Component className={`terminal-typewriter-wrap ${className}`}>
      <span ref={textRef} className="typewriter-text" />
      {cursor && (
        <span
          ref={cursorRef}
          className={`terminal-cursor ${isTyping ? 'cursor-typing' : 'cursor-idle'}`}
          aria-hidden="true"
        >
          {cursorChar}
        </span>
      )}
    </Component>
  );
}
