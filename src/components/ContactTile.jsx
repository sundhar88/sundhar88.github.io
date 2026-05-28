/**
 * ContactTile — contact links
 */
import BentoTile from './BentoTile';

const CONTACTS = [
  {
    href: 'mailto:sundhar.pvt1@gmail.com',
    icon: 'ri-mail-send-line',
    label: 'Email',
  },
  {
    href: 'https://linkedin.com/in/sundharm',
    icon: 'ri-linkedin-box-line',
    label: 'LinkedIn',
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
  return (
    <BentoTile id="contact-tile" className="span-1">
      <div className="tile-header">cat contact.txt</div>
      <p className="contact-subtitle">// digital coordinates</p>
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
