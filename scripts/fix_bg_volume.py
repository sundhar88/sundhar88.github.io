import re

def update_css():
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # Add --bg-primary-rgb
    css = css.replace('--bg-primary:        #000000;', '--bg-primary:        #000000;\n    --bg-primary-rgb:    0, 0, 0;')
    css = css.replace('--bg-primary:       #e0e0e0;', '--bg-primary:       #e0e0e0;\n    --bg-primary-rgb:   224, 224, 224;')
    
    # Update widget and menu background
    css = css.replace('background: rgba(var(--bg-secondary-rgb), 0.7);', 'background: rgba(var(--bg-primary-rgb), 0.85);')
    css = css.replace('background: rgba(var(--bg-secondary-rgb), 0.95);', 'background: rgba(var(--bg-primary-rgb), 0.85);')

    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)

def update_html():
    for filename in ['index.html', 'mdr.html']:
        with open(filename, 'r', encoding='utf-8') as f:
            html = f.read()
        
        volume_html = '''            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                <span style="font-size: 0.7rem;">VOL</span>
                <input type="range" id="sc-volume" min="0" max="100" value="50" style="width: 100%; accent-color: var(--accent); cursor: pointer;">
            </div>
        </div>'''
        
        # We replace the closing </div> of .music-widget
        # Find where it is:
        #             </div>
        #             <div id="sc-seek-bar" ...>
        #                 ...
        #             </div>
        #         </div>
        
        # A simpler replace:
        old_seek_bar = '''            <div id="sc-seek-bar" style="height: 4px; background: var(--bg-primary); border: 1px solid var(--accent); cursor: pointer; position: relative;">
                <div id="sc-seek-fill" style="width: 0%; height: 100%; background: var(--accent); pointer-events: none; transition: width 0.1s linear;"></div>
            </div>
        </div>'''
        
        new_seek_bar = '''            <div id="sc-seek-bar" style="height: 4px; background: var(--bg-primary); border: 1px solid var(--accent); cursor: pointer; position: relative;">
                <div id="sc-seek-fill" style="width: 0%; height: 100%; background: var(--accent); pointer-events: none; transition: width 0.1s linear;"></div>
            </div>''' + '\n' + volume_html
            
        html = html.replace(old_seek_bar, new_seek_bar)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(html)

def update_js():
    with open('scripts.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # Update menu toggle label
    old_toggle_logic = "optionsMenu.classList.toggle('open');"
    new_toggle_logic = "const isOpen = optionsMenu.classList.toggle('open');\n            optionsToggleBtn.textContent = isOpen ? '[ CLOSE ]' : '[ OPTIONS ]';"
    js = js.replace(old_toggle_logic, new_toggle_logic)

    # Add volume logic to the SoundCloud Widget API integration
    # Find widget binding area: `widget.bind(SC.Widget.Events.READY, () => {`
    old_ready = "widget.bind(SC.Widget.Events.READY, () => {"
    new_ready = """widget.bind(SC.Widget.Events.READY, () => {
            const savedVol = sessionStorage.getItem('scVolume') || 50;
            widget.setVolume(savedVol);
            const volSlider = document.getElementById('sc-volume');
            if (volSlider) {
                volSlider.value = savedVol;
                volSlider.addEventListener('input', (e) => {
                    widget.setVolume(e.target.value);
                    sessionStorage.setItem('scVolume', e.target.value);
                });
            }"""
    
    js = js.replace(old_ready, new_ready)
    
    # Also we should look for where we bind to SC events and ensure volume slider works even if SC widget is already ready.
    # We can just put a global initialization inside the DOMContentLoaded block for the volume slider.
    # Actually wait, the volume slider needs to interact with the widget. The code above handles it on READY. 
    # What if widget is already ready? The SC Widget API fires READY when it loads.
    
    with open('scripts.js', 'w', encoding='utf-8') as f:
        f.write(js)

update_css()
update_html()
update_js()
print("Updates applied.")
