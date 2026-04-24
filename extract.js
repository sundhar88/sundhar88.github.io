const fs = require('fs'); 
const content = fs.readFileSync('temp_ascii2.html', 'utf8'); 
const start = content.indexOf('var n = [];'); 
const end = content.indexOf('</script>', start); 
let scriptContent = content.substring(start, end); 

// Wrap in IIFE to protect scope
scriptContent = '(async function() {\n' + scriptContent + '\n})();';

// Replace the DOM injection logic
scriptContent = scriptContent.replace(
    'document.getElementById("output").innerHTML = "<font color=\\"" + colour + "\\"><pre>" + n[i] + "</font></pre>";',
    'const container = document.getElementById("welcome-ascii-container");\nif(container) { container.textContent = n[i]; }'
);

fs.writeFileSync('welcome-ascii.js', scriptContent);
