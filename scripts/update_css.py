import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add new CSS rules before mobile media query
new_rules = """
/* ----------------------------------------------------------------
   Options Menu & Music Widget
   ---------------------------------------------------------------- */
.options-toggle-btn {
    display: none;
}

.options-menu {
    display: contents;
}

.music-widget {
    width: 100%;
    border: 1px solid var(--accent);
    padding: 0.5rem;
    margin-top: 1rem;
    box-sizing: border-box;
    background: rgba(var(--bg-secondary-rgb), 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.sc-title {
    font-size: 0.7rem;
    margin-bottom: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.8;
}

.radio-ascii {
    color: var(--accent);
    font-size: 0.15rem;
    line-height: 1;
    white-space: pre;
    margin-bottom: 0.5rem;
    display: block;
    overflow: hidden;
    text-align: center;
}

"""
css = css.replace('@media (max-width: 767px) {', new_rules + '\n@media (max-width: 767px) {')

# Modify mobile media query
mobile_additions = """
    .options-toggle-btn {
        display: block;
    }

    .options-menu {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(var(--bg-secondary-rgb), 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 9998;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;
    }

    .options-menu.open {
        display: flex;
    }

    .options-menu .accent-switcher,
    .options-menu .theme-toggle,
    .options-menu .effects-panel,
    .options-menu .mdr-controls {
        position: static;
        width: auto;
        align-items: center;
    }

    .hero-ascii, .ascii-hand {
        display: block !important;
        order: -1;
        margin-bottom: 2rem;
    }

    section[style*="display: flex"] {
        flex-direction: column;
        text-align: center;
    }
"""

css = css.replace('    .ascii-hand { display: none; }', mobile_additions)
css = css.replace('    .accent-switcher { bottom: 1rem; right: 1rem; }', '')
css = css.replace('    .theme-toggle { bottom: 1rem; left: 1rem; padding: 0.5rem; }', '')

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated CSS.")
