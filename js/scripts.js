/**
 * Portfolio scripts.js
 * Handles: scroll animations, tab switching, accent colors, theme toggle
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ============================================================
       Global Click Sound
       ============================================================ */
    const clickSound = new Audio('assets/click.ogg');
    const openWorkSound = new Audio('assets/UI_Open_Works.wav');
    const closeWorkSound = new Audio('assets/UI_Close_works.wav');
    clickSound.preload = 'auto';
    openWorkSound.preload = 'auto';
    closeWorkSound.preload = 'auto';

    document.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.work-card') || e.target.closest('.skill-group-header')) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        }
    });

    /* ============================================================
       Scroll-in Animations (IntersectionObserver)
       ============================================================ */
    const observer = new IntersectionObserver(
        (entries) => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // fire once
            }
        }),
        { threshold: 0.08 }
    );

    document.querySelectorAll('.section').forEach(section => observer.observe(section));


    /* ============================================================
       Accessible Tab Switching (Bento Compatible)
       ============================================================ */
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabPanes    = document.querySelectorAll('.tab-pane');

    function activateTab(trigger) {
        const parentTile = trigger.closest('.bento-tile');
        if (!parentTile) return;

        // Deactivate siblings in this specific tile
        parentTile.querySelectorAll('.tab-trigger').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        parentTile.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
            pane.hidden = true;
        });

        // Activate target
        trigger.classList.add('active');
        trigger.setAttribute('aria-selected', 'true');
        
        const tabId = trigger.dataset.tab;
        const target = parentTile.querySelector(`.tab-pane[data-tab="${tabId}"]`);
        if (target) {
            target.classList.add('active');
            target.hidden = false;
        }
    }

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => activateTab(trigger));

        // Keyboard arrow navigation
        trigger.addEventListener('keydown', (e) => {
            const parentTile = trigger.closest('.bento-tile');
            if (!parentTile) return;
            const tabs  = [...parentTile.querySelectorAll('.tab-trigger')];
            const idx   = tabs.indexOf(trigger);
            let newIdx  = idx;

            if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabs.length;
            if (e.key === 'ArrowLeft')  newIdx = (idx - 1 + tabs.length) % tabs.length;

            if (newIdx !== idx) {
                e.preventDefault();
                activateTab(tabs[newIdx]);
                tabs[newIdx].focus();
            }
        });
    });


    /* ============================================================
       Accent Color Switcher
       ============================================================ */
    const colorMap = {
        dark: {
            mono:   '#FFFFFF',
            yellow: '#FFB000',
            green:  '#00FF41',
            red:    '#FF4D4D',
            cyan:   '#00FFFF',
            blue:   '#6699FF',
        },
        light: {
            mono:   '#000000',
            yellow: '#8C6600',
            green:  '#00661A',
            red:    '#B30000',
            cyan:   '#006666',
            blue:   '#0033CC',
        }
    };

    function getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }

    function applyAccent(colorKey) {
        const color = colorMap[getTheme()][colorKey];
        if (!color) return;

        // Animate accent transition with a brief flash on the CSS property
        document.documentElement.style.setProperty('--accent', color);

        // Update button states
        document.querySelectorAll('.accent-btn').forEach(btn => {
            const isActive = btn.dataset.color === colorKey;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });

        // Persist preference
        sessionStorage.setItem('accentColor', colorKey);
    }

    document.querySelectorAll('.accent-btn').forEach(btn => {
        btn.addEventListener('click', () => applyAccent(btn.dataset.color));
    });


    /* ============================================================
       Theme Toggle
       ============================================================ */
    const themeToggle = document.getElementById('theme-toggle');
    const overlay     = document.querySelector('.theme-overlay');
    const icon        = themeToggle?.querySelector('.material-symbols-rounded');

    function applyTheme(theme, animate = false) {
        if (animate && overlay) {
            overlay.classList.remove('animating');
            // Force reflow for re-trigger
            void overlay.offsetWidth;
            overlay.classList.add('animating');
            overlay.addEventListener('animationend', () => {
                overlay.classList.remove('animating');
            }, { once: true });
        }

        document.documentElement.setAttribute('data-theme', theme);

        if (icon) icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
            themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
        }

        // Re-apply accent color for new theme
        const savedAccent = sessionStorage.getItem('accentColor') || 'mono';
        document.documentElement.style.setProperty('--accent', colorMap[theme][savedAccent]);
    }

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Initialise theme on load
    const savedTheme = localStorage.getItem('theme') || getSystemTheme();
    applyTheme(savedTheme, false);

    // Restore accent
    const savedAccent = sessionStorage.getItem('accentColor') || 'mono';
    applyAccent(savedAccent);

    // Toggle on click
    themeToggle?.addEventListener('click', () => {
        const current  = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme, true);
    });

    // Sync with OS preference change (only if no manual override)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light', true);
        }
    });

    /* ============================================================
       Effects Toggles (CRT & Interlace)
       ============================================================ */
    const crtBtn = document.getElementById('crt-toggle');
    const interlaceBtn = document.getElementById('interlace-toggle');
    const glowBtn = document.getElementById('glow-toggle');

    function updateEffect(effectName, btnEl, isEnabled) {
        if (isEnabled) {
            document.body.classList.add(`${effectName}-enabled`);
            if (btnEl) {
                btnEl.classList.add('active');
                let label = effectName.toUpperCase();
                if (effectName === 'text-interlace') label = 'FX';
                if (effectName === 'glow') label = 'BORDER GLOW';
                btnEl.textContent = `[ ${label}: ON ]`;
            }
            localStorage.setItem(`${effectName}Enabled`, 'true');
        } else {
            document.body.classList.remove(`${effectName}-enabled`);
            if (btnEl) {
                btnEl.classList.remove('active');
                let label = effectName.toUpperCase();
                if (effectName === 'text-interlace') label = 'FX';
                if (effectName === 'glow') label = 'BORDER GLOW';
                btnEl.textContent = `[ ${label}: OFF ]`;
            }
            localStorage.setItem(`${effectName}Enabled`, 'false');
        }
    }

    // Initialize effects - default to false if not set
    const isCrtEnabled = localStorage.getItem('crtEnabled') === 'true';
    const isInterlaceEnabled = localStorage.getItem('interlaceEnabled') === 'true';
    const isGlowEnabled = localStorage.getItem('glowEnabled') === 'true';
    
    updateEffect('crt', crtBtn, isCrtEnabled);
    updateEffect('text-interlace', interlaceBtn, isInterlaceEnabled);
    updateEffect('glow', glowBtn, isGlowEnabled);

    crtBtn?.addEventListener('click', () => {
        const currentlyEnabled = document.body.classList.contains('crt-enabled');
        updateEffect('crt', crtBtn, !currentlyEnabled);
    });

    interlaceBtn?.addEventListener('click', () => {
        const currentlyEnabled = document.body.classList.contains('text-interlace-enabled');
        updateEffect('text-interlace', interlaceBtn, !currentlyEnabled);
    });

    glowBtn?.addEventListener('click', () => {
        const currentlyEnabled = document.body.classList.contains('glow-enabled');
        updateEffect('glow', glowBtn, !currentlyEnabled);
    });


    /* ============================================================
       Screensaver Logic (DVD Bounce)
       ============================================================ */
    /*
    const screensaverBtn = document.getElementById('screensaver-toggle');
    const screensaver = document.getElementById('screensaver');
    const screensaverLogo = document.getElementById('screensaver-logo');
    
    let ssAnimationId;
    let ssX = 0, ssY = 0;
    let ssDX = 2.5, ssDY = 2.5;

    function startScreensaver() {
        if (!screensaver || !screensaverLogo) return;
        
        const colorKey = sessionStorage.getItem('accentColor') || 'mono';
        const darkColor = colorMap['dark'][colorKey];
        document.body.style.setProperty('--ss-accent', darkColor);
        screensaverLogo.style.backgroundColor = darkColor;

        screensaver.classList.add('active');
        
        // Use a small timeout to ensure display: block has taken effect for dimensions
        setTimeout(() => {
            const logoW = screensaverLogo.offsetWidth || 400;
            const logoH = screensaverLogo.offsetHeight || 133;
            const vW = window.innerWidth;
            const vH = window.innerHeight;

            ssX = Math.random() * Math.max(0, vW - logoW);
            ssY = Math.random() * Math.max(0, vH - logoH);
            ssDX = (Math.random() > 0.5 ? 1 : -1) * 3;
            ssDY = (Math.random() > 0.5 ? 1 : -1) * 3;
            
            if (ssAnimationId) cancelAnimationFrame(ssAnimationId);
            animate();
        }, 10);
        
        function animate() {
            if (!screensaver.classList.contains('active')) return;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const lw = screensaverLogo.offsetWidth || 240;
            const lh = screensaverLogo.offsetHeight || 100;

            ssX += ssDX;
            ssY += ssDY;
            
            if (ssX <= 0) { ssX = 0; ssDX = Math.abs(ssDX); }
            else if (ssX + lw >= vw) { ssX = vw - lw; ssDX = -Math.abs(ssDX); }

            if (ssY <= 0) { ssY = 0; ssDY = Math.abs(ssDY); }
            else if (ssY + lh >= vh) { ssY = vh - lh; ssDY = -Math.abs(ssDY); }
            
            screensaverLogo.style.transform = `translate(${ssX}px, ${ssY}px)`;
            ssAnimationId = requestAnimationFrame(animate);
        }
        
        if (ssAnimationId) cancelAnimationFrame(ssAnimationId);
        animate();
    }

    function stopScreensaver() {
        if (screensaver) {
            screensaver.classList.remove('active');
            if (ssAnimationId) cancelAnimationFrame(ssAnimationId);
        }
    }

    screensaverBtn?.addEventListener('click', startScreensaver);
    screensaver?.addEventListener('click', stopScreensaver);
    */

    /* ============================================================
       Animated ASCII Art (magic.sh - 3D Torus)
       ============================================================ */
    let A = 0, B = 0;
    function drawMagic() {
        let b = [];
        let z = [];
        A += 0.07;
        B += 0.03;
        let cA = Math.cos(A), sA = Math.sin(A),
            cB = Math.cos(B), sB = Math.sin(B);
        for (let k = 0; k < 1760; k++) {
            b[k] = k % 80 === 79 ? "\n" : " ";
            z[k] = 0;
        }
        for (let j = 0; j < 6.28; j += 0.07) {
            let ct = Math.cos(j), st = Math.sin(j);
            for (let i = 0; i < 6.28; i += 0.02) {
                let sp = Math.sin(i), cp = Math.cos(i),
                    h = ct + 2,
                    D = 1 / (sp * h * sA + st * cA + 5),
                    t = sp * h * cA - st * sA;
                let x = 0 | (40 + 30 * D * (cp * h * cB - t * sB)),
                    y = 0 | (12 + 15 * D * (cp * h * sB + t * cB)),
                    o = x + 80 * y,
                    N = 0 | (8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
                if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]) {
                    z[o] = D;
                    b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0];
                }
            }
        }
        const magicEl = document.getElementById('magic-ascii');
        if(magicEl) magicEl.textContent = b.join("");
    }
    setInterval(drawMagic, 50);

    /* ============================================================
       Animated ASCII Art (outro.sh - Drunk That's All Folks)
       ============================================================ */
    const outroFrames = [
`
    That's all folks!
         (drunk)
         _   _
        ( )_( )
         (o o)
        (  V  )
       /  |  | \\
      /___|__|__\\
`,
`
    That's all folks!
         (drunk)
         _   _
        ( )_( )
         (> <)
        (  -  )
       /  |  | \\
      /___|__|__\\
`,
`
    That's all folks!
         (drunk)
         _   _
        ( )_( )
         (@ @)
        (  ~  )
       /  |  | \\
      /___|__|__\\
`
    ];
    let currentOutroFrame = 0;
    function drawOutro() {
        const el = document.getElementById('outro-ascii');
        if (el) {
            el.textContent = outroFrames[currentOutroFrame];
            currentOutroFrame = (currentOutroFrame + 1) % outroFrames.length;
        }
    }
    setInterval(drawOutro, 300);

    /* ============================================================
       Navigation Logic
       ============================================================ */
    /*
    const refinementToggleBtn = document.getElementById('refinement-toggle');
    refinementToggleBtn?.addEventListener('click', () => {
        window.location.href = 'temp/mdr.html';
    });
    */

    /* ============================================================
       Music Widget Logic
       ============================================================ */
    const scIframe = document.getElementById('sc-iframe');
    const scPlayBtn = document.getElementById('sc-play');
    const scPrevBtn = document.getElementById('sc-prev');
    const scNextBtn = document.getElementById('sc-next');
    const scSeekBar = document.getElementById('sc-seek-bar');
    const scSeekFill = document.getElementById('sc-seek-fill');
    const scTitle = document.getElementById('sc-title');

    if (scIframe && window.SC) {
        const widget = SC.Widget(scIframe);
        let trackDuration = 1;
        let isSeeking = false;

        widget.bind(SC.Widget.Events.READY, () => {
            const savedVol = Number(sessionStorage.getItem('scVolume') ?? 50) || 50;
            widget.setVolume(savedVol);

            const volSlider  = document.getElementById('sc-volume');
            const volDisplay = document.getElementById('sc-vol-display');

            function applyVolume(val) {
                const v = Number(val);
                widget.setVolume(v);
                sessionStorage.setItem('scVolume', v);
                if (volDisplay) volDisplay.textContent = v;
            }

            if (volSlider) {
                volSlider.value = savedVol;
                if (volDisplay) volDisplay.textContent = savedVol;

                volSlider.addEventListener('input', (e) => applyVolume(e.target.value));
                volSlider.addEventListener('change', (e) => applyVolume(e.target.value));
            }

            function updateTitle() {
                widget.getCurrentSound((sound) => {
                    if (scTitle && sound) {
                        const title = sound.title || 'Unknown Track';
                        scTitle.innerHTML = `<span>${title}</span>`;
                        const span = scTitle.querySelector('span');
                        if (span.offsetWidth > scTitle.offsetWidth) {
                            span.innerHTML = `${title} &nbsp;&nbsp;&nbsp; ${title} &nbsp;&nbsp;&nbsp;`;
                            scTitle.classList.add('marquee');
                        } else {
                            scTitle.classList.remove('marquee');
                        }
                    }
                });
            }

            widget.getDuration((duration) => {
                trackDuration = duration;
            });
            
            updateTitle();

            const savedPos = sessionStorage.getItem('sc_position');
            const wasPlaying = sessionStorage.getItem('sc_playing') === 'true';
            
            if (savedPos) {
                widget.seekTo(parseInt(savedPos, 10));
            }
            if (wasPlaying) {
                widget.play();
            }

            // Events inside READY to share scope
            widget.bind(SC.Widget.Events.PLAY, () => {
                if(scPlayBtn) scPlayBtn.textContent = '[ PAUSE ]';
                sessionStorage.setItem('sc_playing', 'true');
                updateTitle(); 
            });

            widget.bind(SC.Widget.Events.PAUSE, () => {
                if(scPlayBtn) scPlayBtn.textContent = '[ PLAY ]';
                sessionStorage.setItem('sc_playing', 'false');
            });

            widget.bind(SC.Widget.Events.PLAY_PROGRESS, (e) => {
                if (!isSeeking) {
                    sessionStorage.setItem('sc_position', e.currentPosition);
                    if(scSeekFill) {
                        const percent = (e.currentPosition / trackDuration) * 100;
                        scSeekFill.style.width = `${percent}%`;
                    }
                }
            });

            scPlayBtn?.addEventListener('click', () => widget.toggle());
            scPrevBtn?.addEventListener('click', () => widget.prev());
            scNextBtn?.addEventListener('click', () => widget.next());

            scSeekBar?.addEventListener('click', (e) => {
                isSeeking = true;
                const rect = scSeekBar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = clickX / rect.width;
                const targetPos = percent * trackDuration;
                if(scSeekFill) scSeekFill.style.width = `${percent * 100}%`;
                sessionStorage.setItem('sc_position', targetPos);
                widget.seekTo(targetPos);
                setTimeout(() => { isSeeking = false; }, 200);
            });
        });
    }

    /* ============================================================
       Skill Accordion
       ============================================================ */
    document.querySelectorAll('.skill-group-header').forEach(header => {
        header.addEventListener('click', () => {
            const group  = header.closest('.skill-group');
            const body   = group.querySelector('.skill-group-body');
            const arrow  = header.querySelector('.skill-group-arrow');
            const isOpen = group.hasAttribute('data-open');

            // Close all other open groups (single-open accordion)
            document.querySelectorAll('.skill-group[data-open]').forEach(openGroup => {
                if (openGroup !== group) {
                    openGroup.removeAttribute('data-open');
                    openGroup.querySelector('.skill-group-body').hidden = true;
                    openGroup.querySelector('.skill-group-header').setAttribute('aria-expanded', 'false');
                    const a = openGroup.querySelector('.skill-group-arrow');
                    if (a) a.textContent = '[+]';
                }
            });

            if (isOpen) {
                group.removeAttribute('data-open');
                body.hidden = true;
                header.setAttribute('aria-expanded', 'false');
                if (arrow) arrow.textContent = '[+]';
            } else {
                group.setAttribute('data-open', '');
                body.hidden = false;
                header.setAttribute('aria-expanded', 'true');
                if (arrow) arrow.textContent = '[-]';
            }
        });
    });

    /* ============================================================
       Dynamic overflow guard
       ============================================================ */

    function checkOverflow() {
        document.body.style.overflowY =
            document.documentElement.scrollHeight > window.innerHeight ? 'auto' : 'hidden';
    }

    window.addEventListener('load',   checkOverflow);
    window.addEventListener('resize', checkOverflow);



    /* ============================================================
       System Menu (Obsolete in Bento)
       ============================================================ */
    // All controls are now integrated as tiles.


    /* ============================================================
       Work Card → Modal
       ============================================================ */
    const workModal       = document.getElementById('work-modal');
    const workModalClose  = document.getElementById('work-modal-close');

    function openWorkModal(card) {
        if (!workModal) return;
        document.getElementById('modal-title').textContent       = card.dataset.title       || '';
        document.getElementById('modal-period').textContent      = card.dataset.period      || '';
        document.getElementById('modal-role').textContent        = card.dataset.role        || '';
        document.getElementById('modal-impact-user').textContent = card.dataset.impactUser  || '';
        document.getElementById('modal-impact-biz').textContent  = card.dataset.impactBiz   || '';
        document.getElementById('modal-stack').textContent       = card.dataset.stack       || '';
        workModal.removeAttribute('hidden');
        openWorkSound.currentTime = 0;
        openWorkSound.play().catch(() => {});
        workModalClose?.focus();
    }

    function closeWorkModal() {
        workModal?.setAttribute('hidden', '');
        closeWorkSound.currentTime = 0;
        closeWorkSound.play().catch(() => {});
    }

    document.querySelectorAll('.work-card').forEach(card => {
        card.addEventListener('click', () => openWorkModal(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openWorkModal(card);
            }
        });
    });

    workModalClose?.addEventListener('click', closeWorkModal);

    // Close modal on backdrop click
    workModal?.addEventListener('click', (e) => {
        if (e.target === workModal) closeWorkModal();
    });

    // Close modal on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && workModal && !workModal.hasAttribute('hidden')) {
            closeWorkModal();
        }
    });

});
