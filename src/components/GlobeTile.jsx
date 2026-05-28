import createGlobe from "cobe";
import { useEffect, useRef, useState, useCallback } from "react";
import BentoTile from './BentoTile';

const ACCENT_COLORS = {
  mono:   { dark: [1, 1, 1],     light: [0, 0, 0] },
  yellow: { dark: [1, 0.69, 0],  light: [0.5, 0.37, 0] },
  green:  { dark: [0, 1, 0.25],  light: [0, 0.4, 0.1] },
  red:    { dark: [1, 0.3, 0.3],  light: [0.7, 0, 0] },
  cyan:   { dark: [0, 1, 1],     light: [0, 0.4, 0.4] },
  blue:   { dark: [0.4, 0.6, 1],  light: [0, 0.2, 0.8] },
  purple: { dark: [0.82, 0.64, 1], light: [0.48, 0.16, 0.8] },
  pink:   { dark: [1, 0.5, 0.75], light: [0.72, 0, 0.36] }
};

export default function GlobeTile({ theme, accent }) {
  const canvasRef = useRef();
  const globeRef = useRef();
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const [visitorLocation, setVisitorLocation] = useState(null);
  
  // State for controls
  const [autoRotate, setAutoRotate] = useState(true);
  const [phi, setPhi] = useState(0);
  const [theta, setTheta] = useState(0.2);
  const [mapSamples, setMapSamples] = useState(16000);
  const [mapBrightness, setMapBrightness] = useState(theme === 'dark' ? 10 : 6);
  const [diffuse, setDiffuse] = useState(1.2);
  const [showControls, setShowControls] = useState(false);

  // Refs for animation values
  const phiRef = useRef(0);
  const thetaRef = useRef(0.2);
  const autoRotateRef = useRef(autoRotate);

  // Sync state to refs for the animation loop
  useEffect(() => {
    phiRef.current = phi;
  }, [phi]);

  useEffect(() => {
    thetaRef.current = theta;
  }, [theta]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Your location (Chennai)
  const myLocation = [13.0827, 80.2707];

  // Fetch visitor IP location
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.latitude && data.longitude) {
          setVisitorLocation([data.latitude, data.longitude]);
        }
      })
      .catch(err => console.warn("Visitor geolocation failed:", err));
  }, []);

  const isDarkRef = useRef(theme === 'dark');
  useEffect(() => {
    isDarkRef.current = theme === 'dark';
    setMapBrightness(theme === 'dark' ? 10 : 6);
  }, [theme]);

  // Main Init / Re-init Effect
  useEffect(() => {
    if (!canvasRef.current) return;

    let globeInstance = null;
    let animationId = null;

    const init = () => {
      if (!canvasRef.current) return;
      const isDark = isDarkRef.current;
      const activeAccent = accent || 'mono';
      const rgb = ACCENT_COLORS[activeAccent] 
        ? ACCENT_COLORS[activeAccent][isDark ? 'dark' : 'light'] 
        : ACCENT_COLORS.mono[isDark ? 'dark' : 'light'];

      const markers = [{ location: myLocation, size: 0.05, id: 'me' }];
      const arcs = [];

      if (visitorLocation) {
        markers.push({ location: visitorLocation, size: 0.05, id: 'you' });
        arcs.push({ from: visitorLocation, to: myLocation });
      }

      try {
        globeInstance = createGlobe(canvasRef.current, {
          devicePixelRatio: 2,
          width: 1000,
          height: 1000,
          phi: phiRef.current,
          theta: thetaRef.current,
          dark: isDark ? 1 : 0,
          diffuse: diffuse,
          mapSamples: mapSamples,
          mapBrightness: mapBrightness,
          baseColor: isDark ? [0.3, 0.3, 0.3] : [1, 1, 1],
          markerColor: rgb,
          glowColor: isDark ? [0, 0, 0] : [1, 1, 1],
          markers: markers,
          arcs: arcs,
          arcColor: rgb,
          arcWidth: 0.05,
          onRender: () => {}
        });
        
        globeRef.current = globeInstance;
        if (canvasRef.current) {
          canvasRef.current.style.opacity = '1';
        }

        const animate = () => {
          if (autoRotateRef.current && !pointerInteracting.current) {
            phiRef.current += 0.005;
          }
          
          if (globeRef.current) {
            globeRef.current.update({ 
              phi: phiRef.current + pointerInteractionMovement.current,
              theta: thetaRef.current
            });
          }
          animationId = requestAnimationFrame(animate);
        };
        animationId = requestAnimationFrame(animate);

      } catch (err) {
        console.warn("Cobe failed:", err);
      }
    };

    const timeout = setTimeout(init, 100);

    return () => {
      clearTimeout(timeout);
      if (globeRef.current) {
        globeRef.current.destroy();
        globeRef.current = null;
      }
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [visitorLocation, mapSamples, accent]); // Re-init on accent change too

  // Property Update Effect (Updates without re-init)
  useEffect(() => {
    if (globeRef.current) {
      const isDark = theme === 'dark';
      const activeAccent = accent || 'mono';
      const rgb = ACCENT_COLORS[activeAccent] 
        ? ACCENT_COLORS[activeAccent][isDark ? 'dark' : 'light'] 
        : ACCENT_COLORS.mono[isDark ? 'dark' : 'light'];

      globeRef.current.update({
        dark: isDark ? 1 : 0,
        mapBrightness: mapBrightness,
        diffuse: diffuse,
        baseColor: isDark ? [0.3, 0.3, 0.3] : [1, 1, 1],
        markerColor: rgb,
        glowColor: isDark ? [0, 0, 0] : [1, 1, 1],
        arcColor: rgb,
      });
    }
  }, [theme, mapBrightness, diffuse, accent]);

  return (
    <BentoTile id="globe-tile" className="span-1">
      <div className="tile-header">
        <span>./location.sh</span>
        <button 
          className="tile-action-btn" 
          onClick={() => setShowControls(!showControls)}
          style={{ fontSize: '0.7rem', padding: '2px 6px' }}
        >
          {showControls ? '[ CLOSE ]' : '[ CONFIG ]'}
        </button>
      </div>
      
      <div className="globe-container" style={{
        position: 'relative',
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
        minHeight: "350px",
        overflow: 'hidden'
      }}>
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta / 100;
            }
          }}
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "1 / 1",
            opacity: 0,
            transition: 'opacity 1s ease',
            cursor: 'grab',
            touchAction: 'none'
          }}
          width="1000"
          height="1000"
        />

        {/* Controls Overlay */}
        {showControls && (
          <div className="globe-controls" style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            background: 'rgba(var(--bg-primary-rgb), 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--accent)',
            padding: '12px',
            zIndex: 10,
            fontSize: '0.7rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono)'
          }}>
            <div className="control-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={autoRotate} 
                  onChange={e => setAutoRotate(e.target.checked)} 
                />
                AUTO-ROTATE
              </label>
            </div>
            <div className="control-group">
              <label>PHI: {phi.toFixed(2)}</label>
              <input 
                type="range" min="0" max="6.28" step="0.01" 
                value={phi} onChange={e => setPhi(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div className="control-group">
              <label>THETA: {theta.toFixed(2)}</label>
              <input 
                type="range" min="-1.57" max="1.57" step="0.01" 
                value={theta} onChange={e => setTheta(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div className="control-group">
              <label>SAMPLES: {mapSamples}</label>
              <input 
                type="range" min="4000" max="40000" step="1000" 
                value={mapSamples} onChange={e => setMapSamples(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div className="control-group">
              <label>BRIGHTNESS: {mapBrightness.toFixed(1)}</label>
              <input 
                type="range" min="0" max="20" step="0.5" 
                value={mapBrightness} onChange={e => setMapBrightness(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div className="control-group">
              <label>GLOW (DIFFUSE): {diffuse.toFixed(1)}</label>
              <input 
                type="range" min="0" max="3" step="0.1" 
                value={diffuse} onChange={e => setDiffuse(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}
      </div>
    </BentoTile>
  );
}
