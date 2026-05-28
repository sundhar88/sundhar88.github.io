/**
 * PrinciplesTile — design principles grid
 */
import BentoTile from './BentoTile';

const PRINCIPLES = [
  {
    title: 'usable',
    desc: 'If it needs an explanation, it needs a redesign. Clarity is not a feature — it\'s the baseline.',
  },
  {
    title: 'intentional',
    desc: 'Every pixel earns its place. Decoration that doesn\'t communicate is just debt.',
  },
  {
    title: 'evidence-based',
    desc: 'Strong opinions, loosely held, heavily tested. Research makes it a decision.',
  },
  {
    title: 'shipped',
    desc: 'Perfect is the enemy of in-production. I build to learn, iterate fast.',
  },
  {
    title: 'honest',
    desc: 'Design should not attempt to manipulate the user with promises that cannot be kept. It is as it is.',
  },
  {
    title: 'minimal',
    desc: 'Less, but better. Back to purity, back to simplicity. Concentrating on essential aspects.',
  },
];

export default function PrinciplesTile() {
  return (
    <BentoTile id="principles-tile" className="span-2">
      <div className="tile-header">my principles.txt</div>
      <div className="principles-grid">
        {PRINCIPLES.map(({ title, desc }) => (
          <div key={title} className="principle-box">
            <h4 className="principle-title">{title}</h4>
            <p className="principle-desc">{desc}</p>
          </div>
        ))}
      </div>
    </BentoTile>
  );
}
