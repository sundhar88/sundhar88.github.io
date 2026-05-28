/**
 * PersonaTile — tabbed persona selection
 */
import { useState } from 'react';
import BentoTile from './BentoTile';
import { applyDecryptedText } from '../utils/decryptedText';

const TABS = [
  {
    id: 'someone',
    label: 'USER',
    ascii: `  ___________________
 |  .-------------.  |
 |  |  welcome :) |  |
 |  |_____________|  |
 |  you found me!    |
 |___________________|
        | | |
       _|_|_|_`,
    text: `I design digital products that work intuitively. I focus on creating experiences that are functional, accessible, and meaningful. Reach out if something resonates.`,
  },
  {
    id: 'recruiter',
    label: 'RECRUITER',
    ascii: `  [skill_matrix.xlsx]
  ┌───────────────────┐
  │ craft      ████ 5 │
  │ systems    ████ 5 │
  │ research   ███_ 4 │
  │ impact     ████ 5 │
  │ shipping   ████ 5 │
  └───────────────────┘
  status: open to roles`,
    text: `5+ years of shipping product at scale — from zero-to-one at startups to enterprise SaaS. I own outcomes, not just deliverables. Senior IC track. Strong in cross-functional collaboration, design systems, and AI-augmented workflows.`,
  },
  {
    id: 'designer',
    label: 'DESIGNER',
    ascii: `  auto-layout: on  ✓
  variables: bound ✓
  components: 100% ✓
  handoff: clean   ✓
  ________________
 / your redlines  \\
| are already done |
 \\________________/`,
    text: `I think in design systems and speak in tokens. Always up for a crit, a collab, or a healthy argument about when to use a sheet vs. a modal. DM me — I don't ghost.`,
  },
  {
    id: 'pm',
    label: 'PM',
    ascii: `  discovery → frame
  frame → prototype
  prototype → test
  test → iterate
  iterate → ship
  ship → measure
  ──────────────►
  repeat until right`,
    text: `I read PRDs before the meeting, ask the uncomfortable "why" questions early, and deliver specs that engineers can actually build. I work closest to PMs who think in outcomes.`,
  },
  {
    id: 'engineer',
    label: 'ENG',
    ascii: `  $ cat design_tokens.json
  $ inspect component.fig
  $ diff --no-surprise
  $ ship --on-time
  > no mystery values
  > no edge case gaps
  > handoff: complete`,
    text: `I write interaction specs, annotate edge cases, and know the difference between 8px and 9px at 1x. My Figma files have real component names and zero "I'll fix it later" layers.`,
  },
];

export default function PersonaTile() {
  const [active, setActive] = useState('someone');

  const handleTab = (id) => {
    setActive(id);
  };

  const tab = TABS.find(t => t.id === active);

  return (
    <BentoTile id="persona-tile" className="span-2">
      <div className="tile-header" id="audience-label">identify --user</div>
      <p style={{ fontSize: '0.75rem', opacity: 0.55, marginBottom: '1rem' }}>
        // select who you are
      </p>

      <div className="tabs-header" role="tablist" aria-label="Audience select">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-trigger${active === t.id ? ' active' : ''}`}
            role="tab"
            aria-selected={active === t.id}
            data-tab={t.id}
            onClick={() => handleTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tabs-content">
        {tab && (
          <div
            key={tab.id}
            className="tab-pane active"
            role="tabpanel"
            id={`panel-${tab.id}`}
          >
            <pre className="ascii-art">{tab.ascii}</pre>
            <p>{tab.text}</p>
          </div>
        )}
      </div>
    </BentoTile>
  );
}
