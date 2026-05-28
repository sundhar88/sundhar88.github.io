/**
 * MusicTile - SoundCloud player with ASCII visualizer
 */
import { useEffect, useRef, useState } from 'react';
import BentoTile from './BentoTile';

const SC_URL = 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/sundhar88/sets/portfolio&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false';

function formatTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}:${rs.toString().padStart(2, '0')}`;
}

export default function MusicTile() {
  const iframeRef = useRef(null);
  const vizRef = useRef(null);
  const vizIntervalRef = useRef(null);
  const widgetRef = useRef(null);

  const [status, setStatus] = useState('STOPPED');
  const [trackTitle, setTrackTitle] = useState('Loading...');
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const trackDurationRef = useRef(1);
  const isSeekingRef = useRef(false);

  const updateVisualizer = () => {
    if (!vizRef.current) return;
    const containerWidth = vizRef.current.clientWidth;
    const containerHeight = vizRef.current.clientHeight;
    const numBars = Math.floor(containerWidth / 18) || 12;
    const rows = Math.floor(containerHeight / 14) || 6;
    const heights = Array.from({ length: numBars }, () => Math.random() * rows);

    let output = '';
    for (let r = rows - 1; r >= 0; r--) {
      let line = '';
      for (let b = 0; b < numBars; b++) {
        const diff = heights[b] - r;
        if (diff >= 1) line += '█ ';
        else if (diff > 0.6) line += '▆ ';
        else if (diff > 0.3) line += '▄ ';
        else if (diff > 0.1) line += '▂ ';
        else line += '  ';
      }
      output += line + '\n';
    }
    vizRef.current.textContent = output;
  };

  const startViz = () => {
    if (vizIntervalRef.current) clearInterval(vizIntervalRef.current);
    vizIntervalRef.current = setInterval(updateVisualizer, 120);
  };

  const stopViz = () => {
    if (vizIntervalRef.current) clearInterval(vizIntervalRef.current);
    vizIntervalRef.current = null;
    if (vizRef.current) {
      const numBars = Math.floor(vizRef.current.clientWidth / 18) || 12;
      vizRef.current.textContent = '\n'.repeat(3) + '  '.repeat(numBars);
    }
  };

  useEffect(() => {
    const initWidget = () => {
      if (!iframeRef.current || !window.SC) return;

      const widget = window.SC.Widget(iframeRef.current);
      widgetRef.current = widget;

      const savedVol = Number(sessionStorage.getItem('scVolume') ?? 50) || 50;
      setVolume(savedVol);

      widget.bind(window.SC.Widget.Events.READY, () => {
        widget.setVolume(savedVol);

        const savedPos = sessionStorage.getItem('sc_position');
        const wasPlaying = sessionStorage.getItem('sc_playing') === 'true';
        if (savedPos) widget.seekTo(parseInt(savedPos, 10));
        if (wasPlaying) widget.play();

        const updateTitle = () => {
          widget.getCurrentSound((sound) => {
            if (sound) {
              setTrackTitle(sound.title || 'Unknown Track');
              widget.getDuration((duration) => {
                trackDurationRef.current = duration;
                setTotalTime(formatTime(duration));
              });
            }
          });
        };
        updateTitle();

        widget.bind(window.SC.Widget.Events.PLAY, () => {
          setStatus('PLAYING');
          sessionStorage.setItem('sc_playing', 'true');
          updateTitle();
          startViz();
        });

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          setStatus('PAUSED');
          sessionStorage.setItem('sc_playing', 'false');
          stopViz();
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          setStatus('STOPPED');
          stopViz();
        });

        widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e) => {
          if (!isSeekingRef.current) {
            sessionStorage.setItem('sc_position', e.currentPosition);
            setCurrentTime(formatTime(e.currentPosition));
            const pct = (e.currentPosition / trackDurationRef.current) * 100;
            setProgress(pct);
          }
        });
      });
    };

    if (window.SC) {
      initWidget();
    } else {
      const check = setInterval(() => {
        if (window.SC) { clearInterval(check); initWidget(); }
      }, 300);
    }

    return () => {
      if (vizIntervalRef.current) clearInterval(vizIntervalRef.current);
    };
  }, []);

  const handlePlay = () => widgetRef.current?.toggle();
  const handlePrev = () => widgetRef.current?.prev();
  const handleNext = () => widgetRef.current?.next();

  const handleSeek = (e) => {
    if (!widgetRef.current) return;
    isSeekingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const targetPos = pct * trackDurationRef.current;
    setProgress(pct * 100);
    setCurrentTime(formatTime(targetPos));
    sessionStorage.setItem('sc_position', targetPos);
    widgetRef.current.seekTo(targetPos);
    setTimeout(() => { isSeekingRef.current = false; }, 200);
  };

  const handleVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    sessionStorage.setItem('scVolume', v);
    widgetRef.current?.setVolume(v);
  };

  return (
    <BentoTile id="music-tile" className="span-1 media-tile">
      <div className="tile-header">./media.sh</div>
      <div className="music-widget">
        <pre id="ascii-visualizer" className="ascii-visualizer" ref={vizRef}>
          {'| | | | | | | | | |\n| | | | | | | | | |\n| | | | | | | | | |'}
        </pre>

        <div className="terminal-player">
          <div className="player-info">
            <span className="player-label">STATUS:</span>
            <span id="player-status" className="player-value">{status}</span>
          </div>
          <div className="player-info">
            <span className="player-label">TRACK:</span>
            <div id="sc-title" className="sc-title player-value">{trackTitle}</div>
          </div>

          <div className="player-controls">
            <button id="sc-prev" className="terminal-btn" title="Previous" onClick={handlePrev}>
              <i className="ri-skip-back-fill"></i> [ PREV ]
            </button>
            <button id="sc-play" className="terminal-btn" title="Play/Pause" onClick={handlePlay}>
              {status === 'PLAYING' ? (
                <><i className="ri-pause-fill"></i> [ PAUSE ]</>
              ) : (
                <><i className="ri-play-fill"></i> [ PLAY ]</>
              )}
            </button>
            <button id="sc-next" className="terminal-btn" title="Next" onClick={handleNext}>
              [ NEXT ] <i className="ri-skip-forward-fill"></i>
            </button>
          </div>

          <div className="player-seek">
            <div className="seek-labels">
              <span id="seek-current">{currentTime}</span>
              <span id="seek-total">{totalTime}</span>
            </div>
            <div id="sc-seek-bar" className="terminal-seek-bar" onClick={handleSeek}>
              <div id="sc-seek-fill" className="terminal-seek-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="player-volume">
            <span className="player-label">VOL:</span>
            <div className="volume-container">
              <input
                type="range"
                id="sc-volume"
                className="terminal-range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolume}
              />
            </div>
          </div>
        </div>
      </div>

      <iframe
        id="sc-iframe"
        ref={iframeRef}
        style={{ display: 'none' }}
        allow="autoplay"
        src={SC_URL}
        title="SoundCloud Player"
      />
    </BentoTile>
  );
}
