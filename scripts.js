/**
 * Portfolio scripts.js
 * Handles: scroll animations, tab switching, accent colors, theme toggle
 */

document.addEventListener('DOMContentLoaded', () => {

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
       Accessible Tab Switching
       ============================================================ */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes   = document.querySelectorAll('.tab-pane');

    function activateTab(button) {
        // Deactivate all
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            pane.hidden = true;
        });

        // Activate target
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        const target = document.getElementById(button.getAttribute('aria-controls'));
        if (target) {
            target.classList.add('active');
            target.hidden = false;
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => activateTab(button));

        // Keyboard arrow navigation within tablist
        button.addEventListener('keydown', (e) => {
            const tabs  = [...tabButtons];
            const idx   = tabs.indexOf(button);
            let newIdx  = idx;

            if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabs.length;
            if (e.key === 'ArrowLeft')  newIdx = (idx - 1 + tabs.length) % tabs.length;
            if (e.key === 'Home')       newIdx = 0;
            if (e.key === 'End')        newIdx = tabs.length - 1;

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

    function updateEffect(effectName, btnEl, isEnabled) {
        if (isEnabled) {
            document.body.classList.add(`${effectName}-enabled`);
            if (btnEl) {
                btnEl.classList.add('active');
                btnEl.textContent = `[ ${effectName === 'crt' ? 'CRT' : 'TEXT FX'}: ON ]`;
            }
            localStorage.setItem(`${effectName}Enabled`, 'true');
        } else {
            document.body.classList.remove(`${effectName}-enabled`);
            if (btnEl) {
                btnEl.classList.remove('active');
                btnEl.textContent = `[ ${effectName === 'crt' ? 'CRT' : 'TEXT FX'}: OFF ]`;
            }
            localStorage.setItem(`${effectName}Enabled`, 'false');
        }
    }

    // Initialize effects
    const isCrtEnabled = localStorage.getItem('crtEnabled') !== 'false';
    const isInterlaceEnabled = localStorage.getItem('interlaceEnabled') !== 'false';
    
    updateEffect('crt', crtBtn, isCrtEnabled);
    updateEffect('text-interlace', interlaceBtn, isInterlaceEnabled);

    crtBtn?.addEventListener('click', () => {
        const currentlyEnabled = document.body.classList.contains('crt-enabled');
        updateEffect('crt', crtBtn, !currentlyEnabled);
    });

    interlaceBtn?.addEventListener('click', () => {
        const currentlyEnabled = document.body.classList.contains('text-interlace-enabled');
        updateEffect('text-interlace', interlaceBtn, !currentlyEnabled);
    });


    /* ============================================================
       Screensaver Logic (DVD Bounce)
       ============================================================ */
    const screensaverBtn = document.getElementById('screensaver-toggle');
    const screensaver = document.getElementById('screensaver');
    const screensaverLogo = document.getElementById('screensaver-logo');
    
    let ssAnimationId;
    let ssX = 0, ssY = 0;
    let ssDX = 2.5, ssDY = 2.5;

    function startScreensaver() {
        if (!screensaver || !screensaverLogo) return;
        
        // Always use dark mode accent color for screensaver
        const colorKey = sessionStorage.getItem('accentColor') || 'mono';
        const darkColor = colorMap['dark'][colorKey];
        screensaverLogo.style.backgroundColor = darkColor;
        document.body.style.setProperty('--ss-accent', darkColor);

        screensaver.classList.add('active');
        
        // Initial random position
        const maxW = window.innerWidth - screensaverLogo.offsetWidth;
        const maxH = window.innerHeight - screensaverLogo.offsetHeight;
        ssX = Math.random() * Math.max(0, maxW);
        ssY = Math.random() * Math.max(0, maxH);
        
        // Randomize initial direction
        ssDX = (Math.random() > 0.5 ? 1 : -1) * 2.5;
        ssDY = (Math.random() > 0.5 ? 1 : -1) * 2.5;
        
        function animate() {
            if (!screensaver.classList.contains('active')) return;
            
            const rect = screensaverLogo.getBoundingClientRect();
            
            ssX += ssDX;
            ssY += ssDY;
            
            if (ssX <= 0 || ssX + rect.width >= window.innerWidth) {
                ssDX *= -1;
                ssX = ssX <= 0 ? 0 : window.innerWidth - rect.width;
            }
            if (ssY <= 0 || ssY + rect.height >= window.innerHeight) {
                ssDY *= -1;
                ssY = ssY <= 0 ? 0 : window.innerHeight - rect.height;
            }
            
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

    /* ============================================================
       Navigation Logic
       ============================================================ */
    const refinementToggleBtn = document.getElementById('refinement-toggle');
    refinementToggleBtn?.addEventListener('click', () => {
        window.location.href = 'mdr.html';
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

});