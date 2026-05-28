/**
 * HeroTile — ASCII name art + properties + site index
 */
import BentoTile from './BentoTile';

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
  { id: 'about-tile',      label: '[ 01. ABOUT ]' },
  { id: 'persona-tile',    label: '[ 02. PERSONAS ]' },
  { id: 'works-tile',      label: '[ 03. WORKS ]' },
  { id: 'skills-tile',     label: '[ 04. SKILLS ]' },
  { id: 'music-tile',      label: '[ 05. MUSIC ]' },
  { id: 'settings-tile',   label: '[ 06. SITE SETTINGS ]' },
  { id: 'contact-tile',    label: '[ 07. CONTACT ]' },
  { id: 'principles-tile', label: '[ 08. PRINCIPLES ]' },
];

function scrollToTile(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export default function HeroTile() {
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
            <span className="prop-val">Senior Product Designer</span>
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
