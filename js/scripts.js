/**
 * Portfolio scripts.js
 * Handles: scroll animations, tab switching, accent colors, theme toggle
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       Splash Screen
       ============================================================ */
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        // Removed text-based borders in favor of CSS background styling

        const startPrompt = document.getElementById('splash-start-prompt');
        const loadingArea = document.getElementById('splash-loading-area');
        
        let hasBooted = false;
        let loadingInterval = null;
        let printLogInterval = null;

        const dismissSplashScreen = () => {
            if (loadingInterval) clearInterval(loadingInterval);
            if (printLogInterval) clearInterval(printLogInterval);
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                if (splashScreen.parentNode) splashScreen.remove();
            }, 300);
        };

        const bootSystem = () => {
            if (hasBooted) {
                dismissSplashScreen();
                return;
            }
            hasBooted = true;

            const mainContent = document.getElementById('splash-main-content');
            const bootSequence = document.getElementById('splash-boot-sequence');
            const bootLogs = document.getElementById('splash-boot-logs');
            const fillEl = document.querySelector('.splash-bar-fill');
            const emptyEl = document.querySelector('.splash-bar-empty');

            if (mainContent) mainContent.style.display = 'none';
            if (bootSequence) bootSequence.style.display = 'flex';

            // Play sound securely after user interaction
            const splashSound = document.getElementById('splash-audio');
            if (splashSound) {
                splashSound.volume = 1.0;
                splashSound.currentTime = 0;
                const playPromise = splashSound.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => console.warn("Splash sound error:", e));
                }
            }

            const totalBlocks = 20;
            let progress = 0;
            const bootDuration = 4000;
            const barInterval = bootDuration / totalBlocks;

            const baseMessages = [
                "BIOS Date 04/22/26 19:14:10 Ver 08.00.15",
                "CPU: UX Processor @ 3.4GHz",
                "Memory Test: 64000K OK",
                "Mounting design system core...",
                "[OK] Loaded typography tokens: Inter, Roboto, IBM Plex Mono",
                "[OK] Allocated empathetic user matrices.",
                "Initializing heuristic evaluation daemon...",
                "Scanning for anti-patterns... [NONE FOUND]",
                "Warming up the color palette... [DONE]",
                "Resolving pixel-perfect constraints...",
                "eth0: link up, 1000Mbps, full-duplex",
                "Loading kernel modules: auto-layout, components, variables...",
                "[WARN] Ignoring 'Make it pop' requests... (Policy restricted)",
                "Synthesizing qualitative research data... 100%",
                "Bypassing dark patterns... [SUCCESS]",
                "Checking contrast ratios... WCAG AAA [PASSED]",
                "Aligning all elements to 8pt grid... OK",
                "Calibrating accessibility standards...",
                "Fetching user personas... [someone, recruiter, designer, pm, engineer]",
                "Waiting for Figma to sync... [TIMEOUT] -> Switching to local cache.",
                "fsck: /dev/sda1: clean, 11/262144 files, 153/1048576 blocks",
                "Mounting /var/log/user_interviews...",
                "Establishing emotional connection module...",
                "Loading bento-grid framework...",
                "[OK] Started Interaction Design Daemon.",
                "[OK] Started Visual Design Daemon.",
                "Applying CRT curvature and scanline overlay...",
                "Applying chromatic aberration filter...",
                "Booting UX-OS core environment...",
                "System architecture verified.",
                "All systems nominal. Ready for launch."
            ];

            const fullLogs = [];
            for (let i = 0; i < 70; i++) {
                if (i % 2 === 0 && baseMessages.length > 0) {
                    fullLogs.push(`[${(i * 0.057).toFixed(3)}] ${baseMessages.shift()}`);
                } else {
                    const addr = "0x" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
                    const mem = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
                    fullLogs.push(`[${(i * 0.057).toFixed(3)}] sys_init: kernel block allocated at ${addr} size=${mem}K`);
                }
            }

            if (fillEl && emptyEl) {
                fillEl.textContent = "";
                emptyEl.textContent = "▒".repeat(totalBlocks);

                loadingInterval = setInterval(() => {
                    progress++;
                    fillEl.textContent = "█".repeat(progress);
                    emptyEl.textContent = "▒".repeat(totalBlocks - progress);

                    if (progress >= totalBlocks) {
                        dismissSplashScreen();
                    }
                }, barInterval);
            }

            let logIndex = 0;
            const logIntervalTime = bootDuration / fullLogs.length;
            if (bootLogs) {
                printLogInterval = setInterval(() => {
                    if (logIndex < fullLogs.length) {
                        const p = document.createElement('div');
                        p.textContent = fullLogs[logIndex];
                        bootLogs.appendChild(p);
                        logIndex++;
                    } else {
                        clearInterval(printLogInterval);
                    }
                }, logIntervalTime);
            }
        };

        splashScreen.addEventListener('click', bootSystem);
        splashScreen.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') bootSystem();
        });
    }


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
            clickSound.play().catch(() => { });
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
    const tabPanes = document.querySelectorAll('.tab-pane');

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

            // Apply DecryptedText effect to paragraphs and ASCII art in the new tab (Desktop only)
            if (window.applyDecryptedText && window.innerWidth >= 768) {
                const options = { encryptedClassName: 'decrypted-encrypted' };

                // Animate paragraphs
                target.querySelectorAll('p').forEach(p => {
                    applyDecryptedText(p, {
                        ...options,
                        speed: 3,
                        sequential: true,
                        revealDirection: 'start'
                    });
                });

                // Animate ASCII art (slightly faster sequential reveal)
                target.querySelectorAll('pre.ascii-art').forEach(pre => {
                    applyDecryptedText(pre, {
                        ...options,
                        speed: 2,
                        sequential: true,
                        revealDirection: 'start'
                    });
                });
            }
        }
    }

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => activateTab(trigger));

        // Keyboard arrow navigation
        trigger.addEventListener('keydown', (e) => {
            const parentTile = trigger.closest('.bento-tile');
            if (!parentTile) return;
            const tabs = [...parentTile.querySelectorAll('.tab-trigger')];
            const idx = tabs.indexOf(trigger);
            let newIdx = idx;

            if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabs.length;
            if (e.key === 'ArrowLeft') newIdx = (idx - 1 + tabs.length) % tabs.length;

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
            mono: '#FFFFFF',
            yellow: '#FFB000',
            green: '#00FF41',
            red: '#FF4D4D',
            cyan: '#00FFFF',
            blue: '#6699FF',
            purple: '#D1A3FF',
            pink: '#FF80BF',
        },
        light: {
            mono: '#000000',
            yellow: '#805E00',
            green: '#00661A',
            red: '#B30000',
            cyan: '#006666',
            blue: '#0033CC',
            purple: '#7A29CC',
            pink: '#B8005D',
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
    const overlay = document.querySelector('.theme-overlay');
    const icon = themeToggle?.querySelector('.material-symbols-rounded');

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
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
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
       Effects Toggles (CRT, Interlace & Glow)
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
                if (effectName === 'crt') label = 'CRT';
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
                if (effectName === 'crt') label = 'CRT';
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
       Music Widget Logic
       ============================================================ */
    const scIframe = document.getElementById('sc-iframe');
    const scPlayBtn = document.getElementById('sc-play');
    const scPrevBtn = document.getElementById('sc-prev');
    const scNextBtn = document.getElementById('sc-next');
    const scSeekBar = document.getElementById('sc-seek-bar');
    const scSeekFill = document.getElementById('sc-seek-fill');
    const scTitle = document.getElementById('sc-title');
    const playerStatus = document.getElementById('player-status');
    const seekCurrent = document.getElementById('seek-current');
    const seekTotal = document.getElementById('seek-total');
    const asciiViz = document.getElementById('ascii-visualizer');

    if (scIframe && window.SC) {
        const widget = SC.Widget(scIframe);
        let trackDuration = 1;
        let isSeeking = false;
        let vizInterval = null;

        function formatTime(ms) {
            const s = Math.floor(ms / 1000);
            const m = Math.floor(s / 60);
            const rs = s % 60;
            return `${m}:${rs.toString().padStart(2, '0')}`;
        }

        function updateVisualizer() {
            if (!asciiViz) return;

            // Calculate bars and rows based on container size
            const containerWidth = asciiViz.clientWidth;
            const containerHeight = asciiViz.clientHeight;

            // Estimate number of characters based on font size (approx 8px width, 12px height)
            const numBars = Math.floor(containerWidth / 18) || 12;
            const rows = Math.floor(containerHeight / 14) || 6;

            const chars = [' ', '░', '▒', '▓', '█'];
            let output = '';

            const heights = Array.from({ length: numBars }, () => Math.random() * rows);

            for (let r = rows - 1; r >= 0; r--) {
                let line = '';
                for (let b = 0; b < numBars; b++) {
                    const diff = heights[b] - r;
                    if (diff >= 1) {
                        line += '█ ';
                    } else if (diff > 0.6) {
                        line += '▓ ';
                    } else if (diff > 0.3) {
                        line += '▒ ';
                    } else if (diff > 0.1) {
                        line += '░ ';
                    } else {
                        line += '  ';
                    }
                }
                output += line + '\n';
            }
            asciiViz.textContent = output;
        }

        function startViz() {
            if (vizInterval) clearInterval(vizInterval);
            vizInterval = setInterval(updateVisualizer, 120);
        }

        function stopViz() {
            if (vizInterval) clearInterval(vizInterval);
            vizInterval = null;
            if (asciiViz) {
                // Static baseline state
                const containerWidth = asciiViz.clientWidth;
                const numBars = Math.floor(containerWidth / 18) || 12;
                asciiViz.textContent = '\n'.repeat(Math.floor(asciiViz.clientHeight / 14) - 1) +
                    '░ '.repeat(numBars);
            }
        }

        widget.bind(SC.Widget.Events.READY, () => {
            const savedVol = Number(sessionStorage.getItem('scVolume') ?? 50) || 50;
            widget.setVolume(savedVol);

            const volSlider = document.getElementById('sc-volume');

            function applyVolume(val) {
                const v = Number(val);
                widget.setVolume(v);
                sessionStorage.setItem('scVolume', v);
            }

            if (volSlider) {
                volSlider.value = savedVol;
                volSlider.addEventListener('input', (e) => applyVolume(e.target.value));
            }

            function updateTitle() {
                widget.getCurrentSound((sound) => {
                    if (scTitle && sound) {
                        const title = sound.title || 'Unknown Track';
                        scTitle.textContent = title;
                        widget.getDuration((duration) => {
                            trackDuration = duration;
                            if (seekTotal) seekTotal.textContent = formatTime(duration);
                        });
                    }
                });
            }

            updateTitle();

            const savedPos = sessionStorage.getItem('sc_position');
            const wasPlaying = sessionStorage.getItem('sc_playing') === 'true';

            if (savedPos) widget.seekTo(parseInt(savedPos, 10));
            if (wasPlaying) widget.play();

            widget.bind(SC.Widget.Events.PLAY, () => {
                if (scPlayBtn) scPlayBtn.textContent = '[⏸PAUSE ]';
                if (playerStatus) playerStatus.textContent = 'PLAYING';
                sessionStorage.setItem('sc_playing', 'true');
                updateTitle();
                startViz();
            });

            widget.bind(SC.Widget.Events.PAUSE, () => {
                if (scPlayBtn) scPlayBtn.textContent = '[◀ PLAY ]';
                if (playerStatus) playerStatus.textContent = 'PAUSED';
                sessionStorage.setItem('sc_playing', 'false');
                stopViz();
            });

            widget.bind(SC.Widget.Events.FINISH, () => {
                if (playerStatus) playerStatus.textContent = 'STOPPED';
                stopViz();
            });

            widget.bind(SC.Widget.Events.PLAY_PROGRESS, (e) => {
                if (!isSeeking) {
                    sessionStorage.setItem('sc_position', e.currentPosition);
                    if (seekCurrent) seekCurrent.textContent = formatTime(e.currentPosition);
                    if (scSeekFill) {
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
                if (scSeekFill) scSeekFill.style.width = `${percent * 100}%`;
                if (seekCurrent) seekCurrent.textContent = formatTime(targetPos);
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
            const group = header.closest('.skill-group');
            const body = group.querySelector('.skill-group-body');
            const arrow = header.querySelector('.skill-group-arrow');
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

    window.addEventListener('load', checkOverflow);
    window.addEventListener('resize', checkOverflow);




    /* ============================================================
       Work Card → Modal
       ============================================================ */
    const workModal = document.getElementById('work-modal');
    const workModalClose = document.getElementById('work-modal-close');

    function openWorkModal(card) {
        if (!workModal) return;
        const clickSound = new Audio('assets/click.ogg');

        const titleEl = document.getElementById('modal-title');
        const periodEl = document.getElementById('modal-period');
        const roleEl = document.getElementById('modal-role');
        const userEl = document.getElementById('modal-impact-user');
        const bizEl = document.getElementById('modal-impact-biz');
        const stackEl = document.getElementById('modal-stack');
        const coverImgEl = document.getElementById('modal-cover-img');

        titleEl.textContent = card.dataset.title || '';
        periodEl.textContent = card.dataset.period || '';
        roleEl.textContent = card.dataset.role || '';
        userEl.innerHTML = card.dataset.impactUser || '';
        bizEl.innerHTML = card.dataset.impactBiz || '';
        
        // Populate tech stack as tags
        const stackStr = card.dataset.stack || '';
        const stackItems = stackStr.split('·').map(s => s.trim()).filter(s => s);
        stackEl.innerHTML = '';
        stackItems.forEach(item => {
            const span = document.createElement('span');
            span.className = 'stack-tag';
            span.textContent = item;
            stackEl.appendChild(span);
        });

        // Set random cover image from Unsplash
        if (coverImgEl) {
            const randomId = Math.floor(Math.random() * 1000);
            coverImgEl.src = `https://images.unsplash.com/photo-${1500000000000 + randomId}?auto=format&fit=crop&w=800&q=80`;
            // Fallback for demo if the above pattern is too specific
            coverImgEl.onerror = () => {
                coverImgEl.src = `https://picsum.photos/seed/${randomId}/800/400?grayscale`;
            };
        }

        workModal.removeAttribute('hidden');

        // Apply decryption effect to plain text elements
        if (window.applyDecryptedText) {
            const options = { encryptedClassName: 'decrypted-encrypted' };
            applyDecryptedText(titleEl, { ...options, speed: 10, maxIterations: 10 });
            applyDecryptedText(periodEl, { ...options, speed: 10, maxIterations: 5 });
            applyDecryptedText(roleEl, { ...options, speed: 4, sequential: true, revealDirection: 'start' });
            
            // Apply to specific elements within impact sections to preserve HTML structure
            userEl.querySelectorAll('.impact-number, .impact-label').forEach(el => {
                applyDecryptedText(el, { ...options, speed: 5, sequential: true });
            });
            bizEl.querySelectorAll('.impact-number, .impact-label').forEach(el => {
                applyDecryptedText(el, { ...options, speed: 5, sequential: true });
            });

            stackEl.querySelectorAll('.stack-tag').forEach(el => {
                applyDecryptedText(el, { ...options, speed: 10, maxIterations: 15 });
            });
        }

        openWorkSound.currentTime = 0;
        openWorkSound.play().catch(() => { });
        workModalClose?.focus();
    }

    function closeWorkModal() {
        workModal?.setAttribute('hidden', '');
        closeWorkSound.currentTime = 0;
        closeWorkSound.play().catch(() => { });
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

    /* ============================================================
       Site Index Navigation
       ============================================================ */
    document.querySelectorAll('.index-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            const target = document.getElementById(targetId);

            if (target) {
                // Scroll into view
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Visual highlight with DecryptedText (Desktop only)
                if (window.innerWidth >= 768 && window.applyDecryptedText) {
                    // Delay slightly to wait for scroll to start
                    setTimeout(() => {
                        const elementsToAnimate = target.querySelectorAll('p, pre.ascii-art, .skill-group-label, .work-card-title, .principle-title, .principle-desc');
                        elementsToAnimate.forEach(el => {
                            window.applyDecryptedText(el, {
                                speed: 4,
                                sequential: true,
                                revealDirection: 'start',
                                encryptedClassName: 'decrypted-encrypted'
                            });
                        });
                    }, 300);
                }
            }
        });
    });

    /* ============================================================
       Custom Cursor Logic
       ============================================================ */
    const customCursor = document.getElementById('custom-cursor');
    const defaultSvg = document.getElementById('cursor-default-svg');
    const pointerSvg = document.getElementById('cursor-pointer-svg');

    if (customCursor && defaultSvg && pointerSvg && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let isPointer = false;
        
        // Define interactive selectors
        const interactiveSelector = 'a, button, [role="button"], [role="tab"], input, textarea, select, .interactive, .theme-toggle';

        document.addEventListener('mousemove', (e) => {
            if (!document.body.classList.contains('custom-cursor-enabled')) {
                document.body.classList.add('custom-cursor-enabled');
            }
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Check if hovering over interactive elements
            const target = e.target;
            const isHoveringClickable = target.closest(interactiveSelector);
            
            if (isHoveringClickable && !isPointer) {
                isPointer = true;
                defaultSvg.classList.remove('active');
                pointerSvg.classList.add('active');
            } else if (!isHoveringClickable && isPointer) {
                isPointer = false;
                pointerSvg.classList.remove('active');
                defaultSvg.classList.add('active');
            }
        });

        const renderCursor = () => {
            // Smooth lerp
            cursorX += (mouseX - cursorX) * 0.8;
            cursorY += (mouseY - cursorY) * 0.8;
            
            // Offset the cursor container so the tip of the SVG matches the actual mouse coordinate
            const offsetX = isPointer ? -14 : -10;
            const offsetY = isPointer ? -6 : -10;
            
            customCursor.style.transform = `translate3d(${cursorX + offsetX}px, ${cursorY + offsetY}px, 0)`;
            
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
    }

});
