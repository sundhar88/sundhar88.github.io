import { useState } from 'react';
import BentoTile from './BentoTile';
import { useSound } from '../hooks/useSound';

const CONTACTS = [
  {
    href: 'mailto:sundhar.pvt1@gmail.com',
    icon: 'ri-mail-send-line',
    label: 'Email App',
  },
  {
    href: 'https://linkedin.com/in/sundharm',
    icon: 'ri-linkedin-box-line',
    label: 'LinkedIn',
    external: true,
  },
  {
    href: 'https://github.com/sundhar88',
    icon: 'ri-github-line',
    label: 'GitHub',
    external: true,
  },
  {
    href: 'https://www.behance.net/sundhardesigns',
    icon: 'ri-behance-line',
    label: 'Behance',
    external: true,
  },
  {
    href: 'https://dribbble.com/sundhar88',
    icon: 'ri-dribbble-line',
    label: 'Dribbble',
    external: true,
  },
];

export default function ContactTile() {
  const [copied, setCopied] = useState(false);
  const { playClick } = useSound();

  const handleCopyEmail = (e) => {
    e.preventDefault();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('sundhar.pvt1@gmail.com');
    }
    setCopied(true);
    if (playClick) playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <BentoTile id="contact-tile" className="span-1">
      <div className="tile-header">cat contact.txt</div>

      <div className="contact-status-bar">
        <span className="contact-status-dot"></span>
        <span className="contact-status-text">OPEN FOR STAFF / LEAD ROLES</span>
      </div>

      <div className="contact-email-card">
        <div className="contact-email-info">
          <span className="contact-email-label">&gt; DIRECT_INBOX:</span>
          <span className="contact-email-addr">sundhar.pvt1@gmail.com</span>
        </div>
        <button
          type="button"
          className={`contact-copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopyEmail}
          aria-label="Copy email address to clipboard"
        >
          {copied ? '[ ✓ COPIED TO CLIPBOARD ]' : '[ COPY EMAIL ]'}
        </button>
      </div>

      <p className="contact-subtitle">// digital networks</p>
      <div className="contact-grid">
        {CONTACTS.map(({ href, icon, label, external }) => (
          <a
            key={label}
            href={href}
            className="contact-box"
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            aria-label={label}
          >
            <i className={icon} aria-hidden="true" />
            <span className="contact-label">{label}</span>
          </a>
        ))}
      </div>
    </BentoTile>
  );
}
