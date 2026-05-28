/**
 * Border Glow utility — adds edge-light elements and pointermove tracking
 */
export function initBorderGlow(tile) {
  if (tile.dataset.glowInit) return;
  tile.dataset.glowInit = '1';
  tile.classList.add('border-glow-active');

  const edgeLight = document.createElement('span');
  edgeLight.className = 'edge-light';
  tile.appendChild(edgeLight);

  tile.addEventListener('pointermove', (e) => {
    if (!document.body.classList.contains('glow-enabled')) return;
    const rect = tile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const [cx, cy] = [rect.width / 2, rect.height / 2];
    const dx = x - cx;
    const dy = y - cy;

    let kx = Infinity, ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    let angle = 0;
    if (dx !== 0 || dy !== 0) {
      const rad = Math.atan2(dy, dx);
      angle = rad * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
    }

    tile.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
    tile.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  });
}
