/**
 * DecryptedText.js
 * A vanilla JS port of the DecryptedText component from React Bits.
 */

class DecryptedText {
    constructor(element, options = {}) {
        this.el = element;
        
        let initialText = options.text || element.textContent;
        // Normalize text for non-PRE elements to avoid unnecessary line breaks/whitespace from HTML source
        if (element.tagName !== 'PRE') {
            initialText = initialText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        }
        
        this.text = initialText;
        this.speed = options.speed || 50;
        this.maxIterations = options.maxIterations || 10;
        this.sequential = options.sequential !== undefined ? options.sequential : false;
        this.revealDirection = options.revealDirection || 'start';
        this.characters = options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
        this.useOriginalCharsOnly = options.useOriginalCharsOnly || false;
        this.className = options.className || '';
        this.parentClassName = options.parentClassName || '';
        this.encryptedClassName = options.encryptedClassName || '';
        
        this.availableChars = this.useOriginalCharsOnly 
            ? Array.from(new Set(this.text.split(''))).filter(char => char !== ' ')
            : this.characters.split('');
            
        this.revealedIndices = new Set();
        this.isAnimating = false;
        this.intervalId = null;
    }

    shuffleText(originalText, currentRevealed) {
        return originalText
            .split('')
            .map((char, i) => {
                if (char === ' ') return ' ';
                if (currentRevealed.has(i)) return originalText[i];
                return this.availableChars[Math.floor(Math.random() * this.availableChars.length)];
            })
            .join('');
    }

    getNextIndex(revealedSet) {
        const textLength = this.text.length;
        switch (this.revealDirection) {
            case 'start':
                return revealedSet.size;
            case 'end':
                return textLength - 1 - revealedSet.size;
            case 'center': {
                const middle = Math.floor(textLength / 2);
                const offset = Math.floor(revealedSet.size / 2);
                const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

                if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
                    return nextIndex;
                }

                for (let i = 0; i < textLength; i++) {
                    if (!revealedSet.has(i)) return i;
                }
                return 0;
            }
            default:
                return revealedSet.size;
        }
    }

    render(displayText, revealedIndices) {
        this.el.innerHTML = '';
        
        // Preserve original layout as much as possible
        if (this.el.tagName === 'PRE') {
            this.el.style.whiteSpace = 'pre';
        } else {
            this.el.style.whiteSpace = 'normal'; // Use normal for paragraphs to allow natural wrapping
        }

        // SR Only text for accessibility
        const srOnly = document.createElement('span');
        srOnly.textContent = displayText;
        srOnly.style.position = 'absolute';
        srOnly.style.width = '1px';
        srOnly.style.height = '1px';
        srOnly.style.padding = '0';
        srOnly.style.margin = '-1px';
        srOnly.style.overflow = 'hidden';
        srOnly.style.clip = 'rect(0,0,0,0)';
        srOnly.style.border = '0';
        this.el.appendChild(srOnly);

        // Visible text container
        const visibleContainer = document.createElement('span');
        visibleContainer.setAttribute('aria-hidden', 'true');
        
        displayText.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            const isRevealed = revealedIndices.has(index) || (!this.isAnimating);
            
            if (isRevealed && this.className) span.className = this.className;
            else if (!isRevealed && this.encryptedClassName) span.className = this.encryptedClassName;
            
            visibleContainer.appendChild(span);
        });
        
        this.el.appendChild(visibleContainer);
    }

    trigger() {
        if (this.isAnimating) clearInterval(this.intervalId);
        
        this.isAnimating = true;
        this.revealedIndices = new Set();
        let currentIteration = 0;

        // Immediate first render
        const initialText = this.shuffleText(this.text, this.revealedIndices);
        this.render(initialText, this.revealedIndices);

        this.intervalId = setInterval(() => {
            if (this.sequential) {
                if (this.revealedIndices.size < this.text.length) {
                    const nextIndex = this.getNextIndex(this.revealedIndices);
                    this.revealedIndices.add(nextIndex);
                    const displayText = this.shuffleText(this.text, this.revealedIndices);
                    this.render(displayText, this.revealedIndices);
                } else {
                    this.stop();
                }
            } else {
                currentIteration++;
                const displayText = this.shuffleText(this.text, this.revealedIndices);
                this.render(displayText, this.revealedIndices);
                
                if (currentIteration >= this.maxIterations) {
                    this.stop();
                }
            }
        }, this.speed);
    }

    stop() {
        clearInterval(this.intervalId);
        this.isAnimating = false;
        this.el.textContent = this.text;
        // Optionally wrap in spans if classes are needed at the end
        if (this.className) {
            this.render(this.text, new Set([...Array(this.text.length).keys()]));
        }
    }
}

// Global utility to initialize on an element
window.applyDecryptedText = function(element, options = {}) {
    const instance = new DecryptedText(element, options);
    instance.trigger();
    return instance;
};
