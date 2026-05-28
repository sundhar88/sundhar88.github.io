/**
 * BentoTile — base wrapper with border-glow support
 */
import { useRef, useEffect } from 'react';
import { initBorderGlow } from '../utils/borderGlow';

export default function BentoTile({ id, className = '', children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) initBorderGlow(ref.current);
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`bento-tile ${className}`}
      {...props}
    >
      <div className="bento-tile-inner">
        {children}
      </div>
    </section>
  );
}
