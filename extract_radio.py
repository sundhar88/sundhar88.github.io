import urllib.request

html = urllib.request.urlopen('https://ascii.co.uk/animated-art/80s-radio-animated-ascii-art-by-michael-shillingburg.html').read().decode('utf-8')

start = html.find('var n = [];')
end = html.find('</script>', start)

script_content = html[start:end]

# Wrap in IIFE
script_content = '(async function() {\n' + script_content + '\n})();'

# Replace DOM injection
script_content = script_content.replace(
    'document.getElementById("output").innerHTML = "<font color=\\"" + colour + "\\"><pre>" + n[i] + "</font></pre>";',
    'const container = document.getElementById("radio-ascii-container");\nif(container) { container.textContent = n[i]; }'
)

with open('radio-ascii.js', 'w', encoding='utf-8') as f:
    f.write(script_content)

print("Extraction complete.")
