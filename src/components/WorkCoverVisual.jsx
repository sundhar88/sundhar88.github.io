/**
 * WorkCoverVisual — Bespoke vector architectural schematics for case studies
 * Replaces generic random stock imagery with authentic, theme-aware design schematics.
 */

export default function WorkCoverVisual({ title = '' }) {
  const t = title.toLowerCase();

  // 1. Placement Test
  if (t.includes('placement test')) {
    return (
      <svg viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="work-svg-cover" aria-label="Placement Test Architecture Schematic">
        <rect width="800" height="240" fill="currentColor" fillOpacity="0.04" />
        <pattern id="grid-pt" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
        <rect width="800" height="240" fill="url(#grid-pt)" />

        {/* Funnel Flow */}
        <g stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.7">
          <rect x="40" y="80" width="120" height="60" strokeDasharray="3 3" />
          <text x="100" y="108" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">STUDENT_ENTRY</text>
          <text x="100" y="125" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fillOpacity="0.6">Friction Minimized</text>

          <line x1="160" y1="110" x2="220" y2="110" markerEnd="url(#arrow)" />

          <rect x="220" y="65" width="160" height="90" />
          <text x="300" y="95" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">ADAPTIVE ENGINE</text>
          <text x="300" y="115" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fillOpacity="0.8">Gamified Micro-steps</text>
          <text x="300" y="133" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fillOpacity="0.5">Confidence Scoring</text>

          <line x1="380" y1="110" x2="440" y2="110" />

          <rect x="440" y="75" width="150" height="70" strokeDasharray="3 3" />
          <text x="515" y="105" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">CEFR MAPPING</text>
          <text x="515" y="125" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fillOpacity="0.6">Levels A1 → C2</text>

          <line x1="590" y1="110" x2="650" y2="110" />

          <rect x="650" y="80" width="110" height="60" />
          <text x="705" y="108" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">CHECKOUT</text>
          <text x="705" y="125" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fillOpacity="0.8">+28% Velocity</text>
        </g>

        {/* Telemetry footer */}
        <text x="40" y="210" fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" opacity="0.6">
          SYS_METRIC: -42% FUNNEL ABANDONMENT · ONBOARDING COMPLETION 88.4% · LATENCY &lt; 120MS
        </text>
      </svg>
    );
  }

  // 2. Course Product Revamp
  if (t.includes('course product')) {
    return (
      <svg viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="work-svg-cover" aria-label="Course Product Revamp Design System Blueprint">
        <rect width="800" height="240" fill="currentColor" fillOpacity="0.04" />
        <pattern id="grid-cr" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
        <rect width="800" height="240" fill="url(#grid-cr)" />

        {/* Design System Hierarchy */}
        <g stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7">
          {/* Tokens column */}
          <rect x="40" y="45" width="200" height="135" />
          <text x="55" y="70" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" fontWeight="bold">DESIGN_TOKENS.JSON</text>
          <line x1="40" y1="80" x2="240" y2="80" />
          <text x="55" y="102" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">--color-semantic: tokens</text>
          <text x="55" y="122" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">--spacing-modular: 8pt</text>
          <text x="55" y="142" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">--type-scale: 1.250-major</text>
          <text x="55" y="162" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">--elevation: 4-levels</text>

          {/* Components column */}
          <rect x="270" y="45" width="240" height="135" strokeDasharray="3 3" />
          <text x="285" y="70" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" fontWeight="bold">COMPONENT_REGISTRY</text>
          <line x1="270" y1="80" x2="510" y2="80" />
          <text x="285" y="102" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.8">[✓] Adaptive Quiz Engine</text>
          <text x="285" y="122" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.8">[✓] Audio Waveform Reader</text>
          <text x="285" y="142" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.8">[✓] Micro-interaction Feedback</text>
          <text x="285" y="162" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.8">[✓] Focus-Trap Modal Specs</text>

          {/* WCAG Compliance block */}
          <rect x="540" y="45" width="220" height="135" />
          <text x="555" y="70" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" fontWeight="bold">WCAG 2.1 AA COMPLIANCE</text>
          <line x1="540" y1="80" x2="760" y2="80" />
          <text x="555" y="102" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.8">Color Contrast: 7.2:1 (PASS)</text>
          <text x="555" y="122" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.8">Screen Reader Aria: 100%</text>
          <text x="555" y="142" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.8">Full Keyboard Nav: ENABLED</text>
          <text x="555" y="162" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.8">Delivery Speed: +40% YoY</text>
        </g>

        <text x="40" y="210" fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" opacity="0.6">
          SPEC_VERSION: WSE_DS_V2.4 · TOKENS SYNCHRONIZED ACROSS WEB &amp; MOBILE
        </text>
      </svg>
    );
  }

  // 3. Study Planner
  if (t.includes('study planner')) {
    return (
      <svg viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="work-svg-cover" aria-label="Study Planner Timeline Matrix">
        <rect width="800" height="240" fill="currentColor" fillOpacity="0.04" />
        <pattern id="grid-sp" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
        <rect width="800" height="240" fill="url(#grid-sp)" />

        {/* Timeline roadmap */}
        <g stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7">
          <line x1="60" y1="90" x2="740" y2="90" />
          
          {/* Milestone markers */}
          <circle cx="100" cy="90" r="6" fill="currentColor" />
          <text x="100" y="70" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">WEEK 01</text>
          <text x="100" y="120" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.7">Goal Diagnostic</text>

          <circle cx="260" cy="90" r="6" fill="currentColor" />
          <text x="260" y="70" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">WEEK 04</text>
          <text x="260" y="120" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.7">Adaptive Rhythm</text>

          <circle cx="460" cy="90" r="6" fill="currentColor" />
          <text x="460" y="70" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">WEEK 08</text>
          <text x="460" y="120" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.7">Mid-Point Review</text>

          <circle cx="680" cy="90" r="6" fill="currentColor" />
          <text x="680" y="70" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">GRADUATION</text>
          <text x="680" y="120" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.7">+31% Completion</text>

          {/* Velocity Bar */}
          <rect x="100" y="150" width="580" height="12" fill="currentColor" fillOpacity="0.1" />
          <rect x="100" y="150" width="480" height="12" fill="currentColor" fillOpacity="0.8" />
          <text x="100" y="178" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" opacity="0.7">STUDY VELOCITY: 82% ADHERENCE TO RECOMMENDED SCHEDULE</text>
        </g>

        <text x="40" y="210" fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" opacity="0.6">
          OUTCOME: +52% STUDENTS REACHING WEEKLY GOALS · -19% 90-DAY ONBOARDING CHURN
        </text>
      </svg>
    );
  }

  // 4. Online Classroom
  if (t.includes('online classroom')) {
    return (
      <svg viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="work-svg-cover" aria-label="Online Classroom WebRTC Layout">
        <rect width="800" height="240" fill="currentColor" fillOpacity="0.04" />
        <pattern id="grid-oc" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
        <rect width="800" height="240" fill="url(#grid-oc)" />

        <g stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7">
          {/* Main Whiteboard */}
          <rect x="40" y="40" width="460" height="140" />
          <text x="60" y="65" fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold">COLLABORATIVE_WHITEBOARD.CANVAS</text>
          <line x1="40" y1="75" x2="500" y2="75" />
          
          <path d="M 80 120 Q 180 80 280 130 T 460 100" strokeDasharray="4 2" />
          <rect x="90" y="95" width="80" height="35" strokeDasharray="2 2" fill="currentColor" fillOpacity="0.05" />
          <text x="130" y="117" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">VOCABULARY</text>

          {/* WebRTC Feeds */}
          <rect x="520" y="40" width="240" height="65" />
          <text x="535" y="60" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">TEACHER_FEED: LIVE [1080p]</text>
          <text x="535" y="80" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.6">Audio: 48kHz Stereo · Latency: 42ms</text>

          <rect x="520" y="115" width="240" height="65" strokeDasharray="3 3" />
          <text x="535" y="135" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">STUDENT_PEERS: [4 CONNECTED]</text>
          <text x="535" y="155" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.6">Interaction Rate: 2.4x / Session</text>
        </g>

        <text x="40" y="210" fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" opacity="0.6">
          PLATFORM_EXPANSION: 200% CLASS BOOKING GROWTH · 85% EFFICACY SENTIMENT RATING
        </text>
      </svg>
    );
  }

  // 5. Auro24
  if (t.includes('auro24')) {
    return (
      <svg viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="work-svg-cover" aria-label="Auro24 MDM Admin Topology">
        <rect width="800" height="240" fill="currentColor" fillOpacity="0.04" />
        <pattern id="grid-a24" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
        </pattern>
        <rect width="800" height="240" fill="url(#grid-a24)" />

        <g stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7">
          <rect x="40" y="45" width="210" height="135" />
          <text x="55" y="70" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" fontWeight="bold">DEVICE_TELEMETRY</text>
          <line x1="40" y1="80" x2="250" y2="80" />
          <text x="55" y="105" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">ACTIVE FLEET: 12,480 UNITS</text>
          <text x="55" y="125" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">KNOX ENROLLED: 98.4%</text>
          <text x="55" y="145" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">ENROLLMENT TIME: -75%</text>
          <text x="55" y="165" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">SUS USABILITY: 92/100</text>

          <rect x="280" y="45" width="480" height="135" strokeDasharray="3 3" />
          <text x="300" y="70" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" fontWeight="bold">POLICY_RULE_ENGINE</text>
          <line x1="280" y1="80" x2="760" y2="80" />
          
          <rect x="300" y="95" width="130" height="65" />
          <text x="315" y="120" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">GEO-FENCE</text>
          <text x="315" y="140" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.6">Status: STRICT</text>

          <rect x="450" y="95" width="130" height="65" />
          <text x="465" y="120" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">KIOSK_MODE</text>
          <text x="465" y="140" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.6">Single-App Lock</text>

          <rect x="600" y="95" width="140" height="65" />
          <text x="615" y="120" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)">WIPE_DAEMON</text>
          <text x="615" y="140" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" opacity="0.6">Instant Zeroize</text>
        </g>

        <text x="40" y="210" fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" opacity="0.6">
          MVP SUCCESS: 10+ ENTERPRISE PRE-ORDERS DIRECTLY GENERATED AT LAUNCH
        </text>
      </svg>
    );
  }

  // 6. InstaSafe (Default / Fallback)
  return (
    <svg viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="work-svg-cover" aria-label="InstaSafe Zero-Trust Architecture Diagram">
      <rect width="800" height="240" fill="currentColor" fillOpacity="0.04" />
      <pattern id="grid-is" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      </pattern>
      <rect width="800" height="240" fill="url(#grid-is)" />

      <g stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.7">
        <rect x="40" y="70" width="140" height="80" strokeDasharray="3 3" />
        <text x="110" y="105" fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">USER_CONTEXT</text>
        <text x="110" y="125" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.7">Device Health + MFA</text>

        <line x1="180" y1="110" x2="250" y2="110" />

        <rect x="250" y="55" width="260" height="110" />
        <text x="380" y="85" fill="currentColor" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">ZERO-TRUST POLICY GATEWAY</text>
        <line x1="250" y1="95" x2="510" y2="95" />
        <text x="380" y="120" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">Continuous Micro-Segmentation</text>
        <text x="380" y="140" fill="currentColor" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.6">Support Tickets: -45%</text>

        <line x1="510" y1="110" x2="580" y2="110" />

        <rect x="580" y="70" width="180" height="80" strokeDasharray="3 3" />
        <text x="670" y="105" fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">PROTECTED APPS</text>
        <text x="670" y="125" fill="currentColor" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle" opacity="0.7">Audit Time: -60%</text>
      </g>

      <text x="40" y="210" fill="currentColor" fontSize="10" fontFamily="var(--font-mono)" opacity="0.6">
        ENTERPRISE OUTCOME: SECURED MULTIPLE FORTUNE 500 CONTRACTS VIA STREAMLINED UX
      </text>
    </svg>
  );
}
