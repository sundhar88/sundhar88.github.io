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
            yellow: '#B59E00',
            green:  '#2EA043',
            red:    '#CF222E',
            cyan:   '#0991B2',
            blue:   '#2F81F7',
        },
        light: {
            mono:   '#000000',
            yellow: '#826F00',
            green:  '#2EA043',
            red:    '#CF222E',
            cyan:   '#0991B2',
            blue:   '#2F81F7',
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
       Dynamic overflow guard
       ============================================================ */
    function checkOverflow() {
        document.body.style.overflowY =
            document.documentElement.scrollHeight > window.innerHeight ? 'auto' : 'hidden';
    }

    window.addEventListener('load',   checkOverflow);
    window.addEventListener('resize', checkOverflow);

});