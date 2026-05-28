/**
 * SplashScreen — Unix-style bootloader splash
 */
import { useState, useRef, useCallback, useEffect } from 'react';

const BASE_MESSAGES = [
  "BIOS Date 04/22/26 19:14:10 Ver 08.00.15",
  "CPU: UX Processor @ 3.4GHz",
  "Memory Test: 64000K OK",
  "Mounting design system core...",
  "[OK] Loaded typography tokens: Inter, Roboto, IBM Plex Mono",
  "[OK] Allocated empathetic user matrices.",
  "Initializing heuristic evaluation daemon...",
  "Scanning for anti-patterns... [NONE FOUND]",
  "Warming up the color palette... [DONE]",
  "Resolving pixel-perfect constraints...",
  "eth0: link up, 1000Mbps, full-duplex",
  "Loading kernel modules: auto-layout, components, variables...",
  "[WARN] Ignoring 'Make it pop' requests... (Policy restricted)",
  "Synthesizing qualitative research data... 100%",
  "Bypassing dark patterns... [SUCCESS]",
  "Checking contrast ratios... WCAG AAA [PASSED]",
  "Aligning all elements to 8pt grid... OK",
  "Calibrating accessibility standards...",
  "Fetching user personas... [someone, recruiter, designer, pm, engineer]",
  "Waiting for Figma to sync... [TIMEOUT] -> Switching to local cache.",
  "fsck: /dev/sda1: clean, 11/262144 files, 153/1048576 blocks",
  "Mounting /var/log/user_interviews...",
  "Establishing emotional connection module...",
  "Loading bento-grid framework...",
  "[OK] Started Interaction Design Daemon.",
  "[OK] Started Visual Design Daemon.",
  "Applying CRT curvature and scanline overlay...",
  "Applying chromatic aberration filter...",
  "Booting UX-OS core environment...",
  "System architecture verified.",
  "All systems nominal. Ready for launch.",
];

const TOTAL_BLOCKS = 20;
const BOOT_DURATION = 4000;

export default function SplashScreen({ onDismiss }) {
  const [phase, setPhase] = useState('idle'); // idle | booting | hidden
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const booted = useRef(false);

  const buildLogs = useCallback(() => {
    const msgs = [...BASE_MESSAGES];
    const full = [];
    for (let i = 0; i < 70; i++) {
      if (i % 2 === 0 && msgs.length > 0) {
        full.push(`[${(i * 0.057).toFixed(3)}] ${msgs.shift()}`);
      } else {
        const addr = '0x' + Math.floor(Math.random() * 16777215).toString(16).padStart(6,'0').toUpperCase();
        const mem = Math.floor(Math.random() * 9999).toString().padStart(4,'0');
        full.push(`[${(i * 0.057).toFixed(3)}] sys_init: kernel block allocated at ${addr} size=${mem}K`);
      }
    }
    return full;
  }, []);

  const boot = useCallback(() => {
    if (booted.current) return;
    booted.current = true;
    setPhase('booting');

    // Play sound
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay audio failed (likely browser policy):", err);
      });
    }

    const fullLogs = buildLogs();
    const logInterval = BOOT_DURATION / fullLogs.length;
    const barInterval = BOOT_DURATION / TOTAL_BLOCKS;

    let logIdx = 0;
    let prog = 0;

    const logTimer = setInterval(() => {
      if (logIdx < fullLogs.length) {
        setLogs(prev => [...prev, fullLogs[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logTimer);
      }
    }, logInterval);

    const barTimer = setInterval(() => {
      prog++;
      setProgress(prog);
      if (prog >= TOTAL_BLOCKS) {
        clearInterval(barTimer);
        clearInterval(logTimer);
        setTimeout(() => {
          setPhase('hidden');
          setTimeout(onDismiss, 350);
        }, 200);
      }
    }, barInterval);
  }, [buildLogs, onDismiss]);

  const handleInteraction = useCallback(() => {
    if (phase === 'booting') {
      // Skip/Dismiss
      setPhase('hidden');
      onDismiss();
    } else if (phase === 'idle') {
      boot();
    }
    
    // Attempt to play sound on any interaction to satisfy browser policies
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  }, [phase, boot, onDismiss]);

  // Auto-boot on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      boot();
    }, 500); 
    return () => clearTimeout(timer);
  }, [boot]);

  if (phase === 'hidden') return null;

  const fill = '█'.repeat(progress);
  const empty = '▒'.repeat(TOTAL_BLOCKS - progress);

  return (
    <div
      id="splash-screen"
      className={phase === 'hidden' ? 'hidden' : ''}
      onClick={handleInteraction}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleInteraction(); }}
      tabIndex={0}
      role="button"
      aria-label="System booting"
    >
      <audio ref={audioRef} src="/assets/splash_sound.wav" preload="auto" />
      <div className="splash-border splash-border-top" />
      <div className="splash-border splash-border-bottom" />
      <div className="splash-border splash-border-left" />
      <div className="splash-border splash-border-right" />

      {/* Idle: main content */}
      {phase === 'idle' && (
        <div className="splash-content">
          <div className="splash-center">
            <h1 className="splash-logo">WELCOME</h1>
            <p className="splash-sub">TO SUNDHAR'S PORTFOLIO</p>
            <div className="splash-system-info">
              <p>SYS.VER: UX-OS v2.4.1</p>
              <p>AUTHOR: SUNDHAR M</p>
              <p>ROLE: PRODUCT DESIGNER</p>
              <p>STATUS: INITIALIZING BOOT SEQUENCE...</p>
            </div>
          </div>
          <div className="splash-bottom">
            <div className="splash-start-prompt">SYSTEM BOOTING AUTOMATICALLY...</div>
          </div>
        </div>
      )}

      {/* Booting: log stream */}
      {phase === 'booting' && (
        <div className="splash-boot-sequence active">
          <div className="splash-boot-logs">
            {logs.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <div className="splash-loading-area">
            <p style={{ marginBottom: '0.5rem' }}>NOW LOADING UX-OS CORE...</p>
            <p className="splash-bar-container">
              [<span className="splash-bar-fill">{fill}</span>
              <span className="splash-bar-empty">{empty}</span>]
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
