/**
 * Border Glow Logic
 * Adapted from ReactBits (https://reactbits.dev/components/border-glow)
 * Integrated for Gitfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    const bentoTiles = document.querySelectorAll('.bento-tile');

    bentoTiles.forEach(tile => {
        // Initialize the tile for border glow
        tile.classList.add('border-glow-active');

        // Create the edge-light element
        const edgeLight = document.createElement('span');
        edgeLight.className = 'edge-light';
        tile.appendChild(edgeLight);

        // Wrap existing children in a bento-tile-inner div
        // (excluding the edgeLight we just added)
        const inner = document.createElement('div');
        inner.className = 'bento-tile-inner';
        
        while (tile.firstChild && tile.firstChild !== edgeLight) {
            inner.appendChild(tile.firstChild);
        }
        
        // Ensure edgeLight is after the inner content for z-index purposes, 
        // or before it if z-index is handled in CSS.
        // In the original, it's a child of the card.
        tile.insertBefore(inner, edgeLight);

        // Pointer move handler
        tile.addEventListener('pointermove', (e) => {
            if (!document.body.classList.contains('glow-enabled')) return;
            
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const [cx, cy] = [rect.width / 2, rect.height / 2];
            const dx = x - cx;
            const dy = y - cy;

            // Edge proximity calculation
            let kx = Infinity;
            let ky = Infinity;
            if (dx !== 0) kx = cx / Math.abs(dx);
            if (dy !== 0) ky = cy / Math.abs(dy);
            const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

            // Cursor angle calculation
            let angle = 0;
            if (dx !== 0 || dy !== 0) {
                const radians = Math.atan2(dy, dx);
                angle = radians * (180 / Math.PI) + 90;
                if (angle < 0) angle += 360;
            }

            tile.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
            tile.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
        });

        // Optional: Sweep animation on hover start
        tile.addEventListener('pointerenter', () => {
            // We could implement the sweep animation here if desired
        });
    });
});
