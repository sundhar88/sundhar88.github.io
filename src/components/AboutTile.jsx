/**
 * AboutTile — bio text
 */
import BentoTile from './BentoTile';

export default function AboutTile() {
  return (
    <BentoTile id="about-tile" className="span-1">
      <div className="tile-header">about_me.txt</div>
      <p>
        Hi, I’m Sundhar. I’m a Senior Product Designer who enjoys turning complex ideas into simple, user-friendly products. I specialize in both the "how it works" and "how it looks."
      </p>
      <p style={{ marginTop: '0.8rem' }}>
        Whether I’m mapping out the logic of a large system or polishing a final interface, my goal is to make things intuitive so users don't have to overthink. By combining a solid design foundation with modern tools, I build practical, high-quality solutions that actually solve user and business problems.
      </p>
    </BentoTile>
  );
}
