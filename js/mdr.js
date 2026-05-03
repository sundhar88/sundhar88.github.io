/**
 * Lumon Macrodata Refinement (MDR) Game Engine
 */
class MDRGame {
    constructor() {
        this.container = document.getElementById('mdr-container');
        this.gridEl = document.getElementById('mdr-grid');
        this.bins = document.querySelectorAll('.mdr-bin');
        
        if (!this.container || !this.gridEl) return;

        this.COLS = 50; 
        this.ROWS = 30; 
        this.cells = [];
        this.badGroups = [];
        this.activeGroup = null;
        this.binProgress = [0, 0, 0, 0, 0];
        
        // Panning state
        this.panX = 0;
        this.panY = 0;
        this.isPanning = false;
        this.startX = 0;
        this.startY = 0;
        this.lastPanX = 0;
        this.lastPanY = 0;
        
        // Mouse state
        this.mouseX = -1000;
        this.mouseY = -1000;
        this.hoverStartTime = Date.now();
        this.lastHoveredCell = null;

        this.init();
    }

    init() {
        this.generateGridData();
        this.attachEvents();
        requestAnimationFrame(() => this.renderLoop());
    }

    generateGridData() {
        this.gridEl.innerHTML = '';
        this.cells = [];
        
        // 1. Generate Noise
        let noiseGrid = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(0));
        for (let r = 0; r < this.ROWS; r++) {
            for (let c = 0; c < this.COLS; c++) {
                noiseGrid[r][c] = Math.random();
            }
        }
        
        // 2. Smooth Noise (3 iterations)
        for (let iter = 0; iter < 3; iter++) {
            let nextGrid = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(0));
            for (let r = 0; r < this.ROWS; r++) {
                for (let c = 0; c < this.COLS; c++) {
                    let sum = noiseGrid[r][c];
                    let count = 1;
                    if(r > 0) { sum += noiseGrid[r-1][c]; count++; }
                    if(r < this.ROWS-1) { sum += noiseGrid[r+1][c]; count++; }
                    if(c > 0) { sum += noiseGrid[r][c-1]; count++; }
                    if(c < this.COLS-1) { sum += noiseGrid[r][c+1]; count++; }
                    nextGrid[r][c] = sum / count;
                }
            }
            noiseGrid = nextGrid;
        }

        // 3. Find Bad Groups
        const threshold = 0.51; 
        const visited = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(false));
        this.badGroups = [];

        for (let r = 0; r < this.ROWS; r++) {
            for (let c = 0; c < this.COLS; c++) {
                if (noiseGrid[r][c] > threshold && !visited[r][c]) {
                    const group = [];
                    const queue = [[r, c]];
                    visited[r][c] = true;
                    
                    while (queue.length > 0) {
                        const [currR, currC] = queue.shift();
                        group.push({r: currR, c: currC});
                        
                        const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
                        for (let d of dirs) {
                            const nr = currR + d[0], nc = currC + d[1];
                            if (nr >= 0 && nr < this.ROWS && nc >= 0 && nc < this.COLS && !visited[nr][nc] && noiseGrid[nr][nc] > threshold) {
                                visited[nr][nc] = true;
                                queue.push([nr, nc]);
                            }
                        }
                    }
                    if (group.length > 3) this.badGroups.push(group);
                }
            }
        }

        // 4. Build DOM
        for (let r = 0; r < this.ROWS; r++) {
            for (let c = 0; c < this.COLS; c++) {
                const cell = document.createElement('div');
                cell.className = 'mdr-cell';
                
                const inner = document.createElement('div');
                inner.className = 'mdr-cell-inner';
                inner.textContent = Math.floor(Math.random() * 10);
                inner.style.animationDelay = `${Math.random() * 2}s`;
                
                cell.appendChild(inner);
                this.gridEl.appendChild(cell);
                this.cells.push({ el: cell, inner: inner, r: r, c: c });
            }
        }
    }

    getCellIndex(r, c) { 
        return r * this.COLS + c; 
    }

    activateGroup(group) {
        if (!group) return;
        
        // Deactivate current
        this.cells.forEach(c => c.el.classList.remove('mdr-active', 'mdr-super-active'));
        
        this.activeGroup = group;
        this.activeGroup.forEach(pos => {
            const cellObj = this.cells[this.getCellIndex(pos.r, pos.c)];
            if (cellObj) {
                cellObj.el.classList.add('mdr-active', 'mdr-super-active');
            }
        });
    }

    refineGroup() {
        if (!this.activeGroup) return;
        
        const binIdx = Math.floor(Math.random() * 5);
        const binEl = this.bins[binIdx];
        const binRect = binEl.getBoundingClientRect();
        
        const groupElements = this.activeGroup.map(pos => this.cells[this.getCellIndex(pos.r, pos.c)]);
        
        groupElements.forEach((cellObj, i) => {
            const el = cellObj.el;
            const rect = el.getBoundingClientRect();
            
            // Clone to animate dropping into bin
            const clone = el.cloneNode(true);
            clone.classList.remove('mdr-active', 'mdr-super-active');
            clone.classList.add('animating');
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.transform = `scale(1)`;
            document.body.appendChild(clone);
            
            // Hide original
            el.style.opacity = '0';
            
            // Animate
            setTimeout(() => {
                clone.style.left = `${binRect.left + binRect.width/2}px`;
                clone.style.top = `${binRect.top + binRect.height/2}px`;
                clone.style.transform = `scale(0.1)`;
                clone.style.opacity = '0';
            }, 50 * i);
            
            setTimeout(() => clone.remove(), 1000 + 50 * i);
        });

        // Update progress visual
        setTimeout(() => {
            this.binProgress[binIdx] += Math.floor(Math.random() * 10) + 5;
            if (this.binProgress[binIdx] > 100) this.binProgress[binIdx] = 100;
            
            const fill = binEl.querySelector('.mdr-bin-fill');
            const label = binEl.querySelector('.mdr-bin-label');
            fill.style.width = `${this.binProgress[binIdx]}%`;
            label.textContent = `${this.binProgress[binIdx]}%`;
        }, 800);

        // Remove refined group from list
        this.badGroups = this.badGroups.filter(g => g !== this.activeGroup);
        this.activeGroup = null;
    }

    attachEvents() {
        // Handle Exit
        const exitBtn = document.getElementById('mdr-exit');
        exitBtn?.addEventListener('click', () => {
            window.location.href = '../index.html';
        });

        // Handle Clicks for Refinement
        this.gridEl.addEventListener('click', (e) => {
            if (e.target.closest('.mdr-super-active') || e.target.closest('.mdr-active')) {
                this.refineGroup();
            }
        });

        // Wheel Panning
        window.addEventListener('wheel', (e) => {
            this.panX -= e.deltaX;
            this.panY -= e.deltaY;
            this.lastPanX = this.panX;
            this.lastPanY = this.panY;
        }, { passive: true });

        // Drag Panning
        this.container.addEventListener('mousedown', (e) => {
            if (e.target.closest('#mdr-bins') || e.target.closest('.effect-btn')) return;
            this.isPanning = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.container.style.cursor = 'grabbing';
        });

        window.addEventListener('mouseup', () => {
            if (this.isPanning) {
                this.lastPanX = this.panX;
                this.lastPanY = this.panY;
            }
            this.isPanning = false;
            this.container.style.cursor = 'default';
        });

        // Mouse Tracking
        this.container.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            if (this.isPanning) {
                this.panX = this.lastPanX + (e.clientX - this.startX);
                this.panY = this.lastPanY + (e.clientY - this.startY);
            }
        });
    }

    renderLoop() {
        if (this.container.classList.contains('active')) {
            const cellW = window.innerWidth / 30;
            const cellH = window.innerHeight / 20;
            const totalW = this.COLS * cellW;
            const totalH = this.ROWS * cellH;

            let closestCell = null;
            let minDist = Infinity;

            this.cells.forEach(cell => {
                if (cell.el.classList.contains('animating') || cell.el.style.opacity === '0') return;

                let rawX = cell.c * cellW + this.panX;
                let rawY = cell.r * cellH + this.panY;
                
                // Infinite wrap
                let wrappedX = ((rawX % totalW) + totalW) % totalW - cellW;
                let wrappedY = ((rawY % totalH) + totalH) % totalH - cellH;
                
                let cx = wrappedX + cellW/2;
                let cy = wrappedY + cellH/2;
                let dist = Math.sqrt(Math.pow(this.mouseX - cx, 2) + Math.pow(this.mouseY - cy, 2));
                
                if (dist < minDist) {
                    minDist = dist;
                    closestCell = cell;
                }

                // Dynamic Scale
                let scale = 1;
                const maxDist = 200;
                if (dist < maxDist) {
                    scale = 1 + (maxDist - dist) / maxDist * 0.8;
                }

                cell.el.style.transform = `translate(${wrappedX}px, ${wrappedY}px) scale(${scale})`;
            });

            // Hover Activation Logic
            if (closestCell && minDist < cellW * 1.5) {
                if (this.lastHoveredCell !== closestCell) {
                    this.lastHoveredCell = closestCell;
                    this.hoverStartTime = Date.now();
                } else if (!this.activeGroup) {
                    // Check if 5 seconds elapsed
                    if (Date.now() - this.hoverStartTime >= 5000) {
                        const group = this.badGroups.find(g => g.some(p => p.r === closestCell.r && p.c === closestCell.c));
                        if (group) {
                            this.activateGroup(group);
                        }
                    }
                }
            } else {
                this.lastHoveredCell = null;
            }
        }
        
        requestAnimationFrame(() => this.renderLoop());
    }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
    new MDRGame();
});
