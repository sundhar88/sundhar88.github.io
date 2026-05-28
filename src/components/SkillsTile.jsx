/**
 * SkillsTile — accordion-based skills inventory
 */
import { useState } from 'react';
import BentoTile from './BentoTile';

const SKILL_GROUPS = [
  {
    id: 'craft',
    icon: '[*]',
    label: 'design craft',
    skills: [
      { name: 'Product Design',        bar: '███████████░', level: 'Expert' },
      { name: 'Interaction Design',    bar: '███████████░', level: 'Expert' },
      { name: 'Visual Design',         bar: '██████████░░', level: 'Advanced' },
      { name: 'Design Systems',        bar: '███████████░', level: 'Expert' },
      { name: 'Information Architecture', bar: '██████████░░', level: 'Advanced' },
      { name: 'Accessibility (WCAG)',  bar: '██████████░░', level: 'Champion' },
    ],
  },
  {
    id: 'tools',
    icon: '[$]',
    label: 'tools & software',
    skills: [
      { name: 'Figma',      bar: '████████████', level: 'Expert' },
      { name: 'FigJam',     bar: '██████████░░', level: 'Advanced' },
      { name: 'Miro',       bar: '██████████░░', level: 'Advanced' },
      { name: 'Notion',     bar: '██████████░░', level: 'Advanced' },
      { name: 'Jira',       bar: '██████████░░', level: 'Advanced' },
      { name: 'GitHub',     bar: '████████░░░░', level: 'Proficient' },
      { name: 'Storybook',  bar: '████████░░░░', level: 'Proficient' },
    ],
  },
  {
    id: 'ai',
    icon: '[~]',
    label: 'ai-augmented workflow',
    skills: [
      { name: 'Claude',        bar: '████████████', level: 'Expert' },
      { name: 'Gemini',        bar: '████████████', level: 'Expert' },
      { name: 'Claude Code',   bar: '██████████░░', level: 'Advanced' },
      { name: 'Claude Design', bar: '██████████░░', level: 'Advanced' },
      { name: 'NotebookLM',    bar: '█████████░░░', level: 'Advanced' },
      { name: 'Antigravity',   bar: '█████████░░░', level: 'Advanced' },
    ],
  },
  {
    id: 'research',
    icon: '[?]',
    label: 'research & validation',
    skills: [
      { name: 'User Interviews',    bar: '███████████░', level: 'Expert' },
      { name: 'Usability Testing',  bar: '███████████░', level: 'Expert' },
      { name: 'Heuristic Analysis', bar: '██████████░░', level: 'Advanced' },
    ],
  },
  {
    id: 'process',
    icon: '[#]',
    label: 'process & methodology',
    skills: [
      { name: 'Design Thinking', bar: '████████████', level: 'Expert' },
      { name: 'Lean UX',         bar: '███████████░', level: 'Expert' },
      { name: 'Agile',           bar: '███████████░', level: 'Expert' },
    ],
  },
];

function SkillGroup({ group, isOpen, onToggle }) {
  return (
    <div className="skill-group" data-open={isOpen ? '' : undefined}>
      <button
        className="skill-group-header"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="skill-group-icon">{group.icon}</span>
        <span className="skill-group-label">{group.label}</span>
        <span className="skill-group-arrow">{isOpen ? '[-]' : '[+]'}</span>
      </button>
      {isOpen && (
        <div className="skill-group-body">
          {group.skills.map((skill, i) => (
            <div key={i} className="skill-row">
              <span className="skill-name">{skill.name}</span>
              <div className="skill-details">
                <span className="skill-bar">{skill.bar}</span>
                <span className="skill-level">{skill.level}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SkillsTile() {
  const [openGroup, setOpenGroup] = useState(null);

  const toggle = (id) => {
    setOpenGroup(prev => prev === id ? null : id);
  };

  return (
    <BentoTile id="skills-tile" className="span-2">
      <div className="tile-header">my skills.xls</div>
      <p style={{ fontSize: '0.75rem', opacity: 0.55, marginBottom: '1rem' }}>
        // click any category to expand
      </p>
      <div className="skill-accordion" id="skill-accordion">
        {SKILL_GROUPS.map(group => (
          <SkillGroup
            key={group.id}
            group={group}
            isOpen={openGroup === group.id}
            onToggle={() => toggle(group.id)}
          />
        ))}
      </div>
    </BentoTile>
  );
}
