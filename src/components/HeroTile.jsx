/**
 * HeroTile — ASCII name art + properties + site index
 */
import { useEffect } from 'react';
import gsap from 'gsap';
import BentoTile from './BentoTile';
import TerminalTypewriter from './TerminalTypewriter';

const ASCII_NAME = `  █████████                            █████ █████                                                       
 ███░░░░░███                          ░░███ ░░███                                                        
░███    ░░░  █████ ████ ████████    ███████  ░███████    ██████   ████████                               
░░█████████ ░░███ ░███ ░░███░░███  ███░░███  ░███░░███  ░░░░░███ ░░███░░███                              
 ░░░░░░░░███ ░███ ░███  ░███ ░███ ░███ ░███  ░███ ░███   ███████  ░███ ░░░                               
 ███    ░███ ░███ ░███  ░███ ░███ ░███ ░███  ░███ ░███  ███░░███  ░███                                   
░░█████████  ░░████████ ████ █████░░████████ ████ █████░░████████ █████                                  
 ░░░░░░░░░    ░░░░░░░░ ░░░░ ░░░░░  ░░░░░░░░ ░░░░ ░░░░░  ░░░░░░░░ ░░░░░                                   
                                                                                                         
                                                                                                         
                                                                                                         
 ██████   ██████                                                     ███                                 
░░██████ ██████                                                     ░░░                                  
 ░███░█████░███  █████ ████ ████████  █████ ████  ███████  ██████   ████  █████ ████  ██████   ████████  
 ░███░░███ ░███ ░░███ ░███ ░░███░░███░░███ ░███  ███░░███ ░░░░░███ ░░███ ░░███ ░███  ░░░░░███ ░░███░░███ 
 ░███ ░░░  ░███  ░███ ░███  ░███ ░░░  ░███ ░███ ░███ ░███  ███████  ░███  ░███ ░███   ███████  ░███ ░███ 
 ░███      ░███  ░███ ░███  ░███      ░███ ░███ ░███ ░███ ███░░███  ░███  ░███ ░███  ███░░███  ░███ ░███ 
 █████     █████ ░░████████ █████     ░░████████░░███████░░████████ █████ ░░███████ ░░████████ ████ █████
░░░░░     ░░░░░   ░░░░░░░░ ░░░░░       ░░░░░░░░  ░░░░░███ ░░░░░░░░ ░░░░░   ░░░░░███  ░░░░░░░░ ░░░░ ░░░░░ 
                                                 ███ ░███                  ███ ░███                      
                                                ░░██████                  ░░██████                       
                                                 ░░░░░░                    ░░░░░░                        
                                                                            `;

const SITE_INDEX = [
  { id: 'about-tile',      label: '[ ABOUT ]' },
  { id: 'persona-tile',    label: '[ PERSONAS ]' },
  { id: 'works-tile',      label: '[ WORKS ]' },
  { id: 'skills-tile',     label: '[ SKILLS ]' },
  { id: 'music-tile',      label: '[ MUSIC ]' },
  { id: 'settings-tile',   label: '[ SETTINGS ]' },
  { id: 'contact-tile',    label: '[ CONTACT ]' },
  { id: 'principles-tile', label: '[ PRINCIPLES ]' },
  { id: 'globe-tile',      label: '[ LOCATION ]' },
];

function scrollToTile(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export default function HeroTile() {
  useEffect(() => {
    if (document.body.classList.contains('safe-mode')) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    gsap.fromTo(
      '.hero-properties .prop-row',
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, ease: 'power2.out', delay: 0.1 }
    );
  }, []);

  return (
    <BentoTile id="hero-tile" className="span-2 row-2">
      <div className="tile-header">./whoami.sh</div>
      <div className="hero-content">
        <pre className="name-ascii">{ASCII_NAME}</pre>

        <div className="hero-properties">
          <div className="prop-row">
            <span className="prop-key">NAME:</span>
            <span className="prop-val">Sundhar M</span>
          </div>
          <div className="prop-row">
            <span className="prop-key">ROLE:</span>
            <span className="prop-val">
              <TerminalTypewriter text="Lead Product Designer & Design Technologist" speed={0.03} cursorChar="█" />
            </span>
          </div>
          <div className="prop-row">
            <span className="prop-key">EXPERIENCE:</span>
            <span className="prop-val">7+ Years of crafting digital experiences</span>
          </div>
          <div className="prop-row">
            <span className="prop-key">FOCUS:</span>
            <span className="prop-val">Minimalist, functional design for complex systems</span>
          </div>
          <div className="prop-row">
            <span className="prop-key">DOMAINS:</span>
            <span className="prop-val">B2B SaaS · EdTech · Fintech</span>
          </div>
          <div className="prop-row">
            <span className="prop-key">LOCATION:</span>
            <span className="prop-val">
              <a
                href="https://www.google.com/maps/place/Chennai,+Tamil+Nadu"
                target="_blank"
                rel="noreferrer"
                className="terminal-link"
              >Chennai, India</a>
            </span>
          </div>
        </div>

        <div className="hero-actions">
          <a href="/resume.pdf" target="_blank" className="cta-button primary">
            [ DOWNLOAD RESUME ]
          </a>
          <a 
            href="#contact-tile" 
            className="cta-button secondary"
            onClick={(e) => { e.preventDefault(); scrollToTile('contact-tile'); }}
          >
            [ GET IN TOUCH ]
          </a>
        </div>

        <div className="hero-index">
          <div className="index-label">SITE_INDEX:</div>
          <nav className="index-nav" aria-label="Site navigation">
            {SITE_INDEX.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className="index-link"
                onClick={(e) => { e.preventDefault(); scrollToTile(id); }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </BentoTile>
  );
}
