/**
 * WorkModal - work detail modal with decrypted text effects
 */
import { useEffect, useRef } from 'react';
import { applyDecryptedText } from '../utils/decryptedText';

export default function WorkModal({ work, onClose }) {
  const titleRef = useRef(null);
  const periodRef = useRef(null);
  const roleRef = useRef(null);

  useEffect(() => {
    if (!work) return;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // DecryptedText effects on desktop
    if (window.innerWidth >= 768 && window.applyDecryptedText) {
      const opts = { encryptedClassName: 'decrypted-encrypted' };
      if (titleRef.current) applyDecryptedText(titleRef.current, { ...opts, speed: 10, maxIterations: 10 });
      if (periodRef.current) applyDecryptedText(periodRef.current, { ...opts, speed: 10, maxIterations: 5 });
      if (roleRef.current) applyDecryptedText(roleRef.current, { ...opts, speed: 4, sequential: true, revealDirection: 'start' });
    }

    // Escape key
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [work, onClose]);

  if (!work) return null;

  const stackItems = (work.stack || '').split('·').map(s => s.trim()).filter(Boolean);
  const randomId = Math.floor(Math.random() * 1000);
  const coverUrl = `https://picsum.photos/seed/${work.title?.length ?? 10 + randomId}/800/400?grayscale`;

  return (
    <div
      id="work-modal"
      className="work-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="work-modal-inner">
        <div className="work-modal-topbar">
          <span className="work-modal-blink">█</span>
          <span id="modal-title" className="work-modal-title" ref={titleRef}>{work.title}</span>
          <button
            className="work-modal-close"
            id="work-modal-close"
            aria-label="Close"
            onClick={onClose}
            autoFocus
          >
            <i className="ri-close-line"></i> [ CLOSE ]
          </button>
        </div>

        <div className="work-modal-body">
          <div className="work-modal-cover">
            <img
              src={coverUrl}
              alt={`Cover for ${work.title}`}
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/${randomId + 50}/800/400?grayscale`;
              }}
            />
          </div>

          <p className="work-modal-period" id="modal-period" ref={periodRef}>{work.period}</p>

          <h3 className="work-modal-section-label">&gt; MY_ROLE.txt</h3>
          <p id="modal-role" ref={roleRef}>{work.role}</p>

          <div className="impact-grid">
            <div className="impact-column">
              <h3 className="work-modal-section-label">&gt; USER_IMPACT.txt</h3>
              <div id="modal-impact-user" className="impact-column"
                dangerouslySetInnerHTML={{ __html: work.impactUser }} />
            </div>
            <div className="impact-column">
              <h3 className="work-modal-section-label">&gt; BUSINESS_IMPACT.txt</h3>
              <div id="modal-impact-biz" className="impact-column"
                dangerouslySetInnerHTML={{ __html: work.impactBiz }} />
            </div>
          </div>

          <h3 className="work-modal-section-label">&gt; TECH_STACK.txt</h3>
          <div id="modal-stack" className="work-modal-stack">
            {stackItems.map((item, i) => (
              <span key={i} className="stack-tag">{item}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
