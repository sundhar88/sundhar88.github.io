import re

def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Wrap in options-menu
    html = html.replace('<div class="accent-switcher"', '<button id="options-toggle" class="effect-btn options-toggle-btn" style="position: fixed; top: 1rem; right: 1rem; z-index: 9999;">[ OPTIONS ]</button>\n    <div id="options-menu" class="options-menu">\n    <div class="accent-switcher"')
    
    # Close options-menu
    html = html.replace('</button>\n\n    <script src="scripts.js">', '</button>\n    </div>\n\n    <script src="scripts.js">')

    # Update music widget
    old_music_widget = '''        <div class="music-widget" style="width: 100%; border: 1px solid var(--accent); padding: 0.5rem; margin-top: 1rem; box-sizing: border-box;">
            <div id="sc-title" style="font-size: 0.7rem; margin-bottom: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.8;">Loading Track...</div>'''
    
    new_music_widget = '''        <div class="music-widget">
            <pre id="radio-ascii-container" class="radio-ascii"></pre>
            <div id="sc-title" class="sc-title">Loading Track...</div>'''
    html = html.replace(old_music_widget, new_music_widget)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

def update_mdr():
    with open('mdr.html', 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace('<div class="mdr-controls">', '<button id="options-toggle" class="effect-btn options-toggle-btn" style="position: fixed; top: 1rem; right: 1rem; z-index: 9999;">[ OPTIONS ]</button>\n    <div id="options-menu" class="options-menu">\n    <div class="mdr-controls">')
    
    # We need to find where mdr-controls ends. It ends before <iframe>
    html = html.replace('        </div>\n        <iframe id="sc-iframe"', '        </div>\n    </div>\n    <iframe id="sc-iframe"')

    old_music_widget = '''        <div class="music-widget" style="width: 100%; border: 1px solid var(--accent); padding: 0.5rem; margin-top: 1rem; box-sizing: border-box;">
            <div id="sc-title" style="font-size: 0.7rem; margin-bottom: 0.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.8;">Loading Track...</div>'''
    new_music_widget = '''        <div class="music-widget">
            <pre id="radio-ascii-container" class="radio-ascii"></pre>
            <div id="sc-title" class="sc-title">Loading Track...</div>'''
    html = html.replace(old_music_widget, new_music_widget)

    with open('mdr.html', 'w', encoding='utf-8') as f:
        f.write(html)

update_index()
update_mdr()
print("Updated HTML files.")
