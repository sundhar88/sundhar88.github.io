/**
 * GradualBlur.js - Vanilla JS port of React Bits GradualBlur
 * github.com/ansh-dhanani
 */

const GradualBlur = (function() {
    const DEFAULT_CONFIG = {
        position: 'bottom',
        strength: 2,
        height: '6rem',
        divCount: 5,
        exponential: false,
        zIndex: 1000,
        animated: false,
        duration: '0.3s',
        easing: 'ease-out',
        opacity: 1,
        curve: 'linear',
        target: 'parent',
        className: '',
        style: {}
    };

    const CURVE_FUNCTIONS = {
        linear: p => p,
        bezier: p => p * p * (3 - 2 * p),
        'ease-in': p => p * p,
        'ease-out': p => 1 - Math.pow(1 - p, 2),
        'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
    };

    function getGradientDirection(position) {
        return {
            top: 'to top',
            bottom: 'to bottom',
            left: 'to left',
            right: 'to right'
        }[position] || 'to bottom';
    }

    function injectStyles() {
        if (typeof document === 'undefined') return;
        const styleId = 'gradual-blur-styles';
        if (document.getElementById(styleId)) return;

        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = `
            .gradual-blur { pointer-events: none; transition: opacity 0.3s ease-out; }
            .gradual-blur-parent { overflow: hidden; position: absolute; }
            .gradual-blur-page { position: fixed; bottom: 0; left: 0; right: 0; }
            .gradual-blur-inner { pointer-events: none; position: relative; width: 100%; height: 100%; }
            .gradual-blur-inner > div { 
                background: rgba(0, 0, 0, 0.05); 
                -webkit-backdrop-filter: inherit; 
                backdrop-filter: inherit; 
            }
            @supports not (backdrop-filter: blur(1px)) {
                .gradual-blur-inner > div { background: rgba(0, 0, 0, 0.5); }
            }
        `;
        document.head.appendChild(styleElement);
    }

    function init(props = {}) {
        injectStyles();

        const config = { ...DEFAULT_CONFIG, ...props };
        const container = document.createElement('div');
        container.className = `gradual-blur gradual-blur-${config.target} ${config.className}`;

        const isPageTarget = config.target === 'page';
        const isVertical = ['top', 'bottom'].includes(config.position);
        const isHorizontal = ['left', 'right'].includes(config.position);

        const containerStyle = {
            pointerEvents: 'none',
            zIndex: 9990, 
            ...config.style
        };

        if (isVertical) {
            containerStyle.height = config.height;
            containerStyle.width = '100%';
            containerStyle[config.position] = 0;
            containerStyle.left = 0;
            containerStyle.right = 0;
        } else if (isHorizontal) {
            containerStyle.width = config.width || config.height;
            containerStyle.height = '100%';
            containerStyle[config.position] = 0;
            containerStyle.top = 0;
            containerStyle.bottom = 0;
        }

        Object.assign(container.style, containerStyle);

        const inner = document.createElement('div');
        inner.className = 'gradual-blur-inner';
        container.appendChild(inner);

        const increment = 100 / config.divCount;
        const curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;
        const direction = getGradientDirection(config.position);

        for (let i = 1; i <= config.divCount; i++) {
            const div = document.createElement('div');
            let progress = i / config.divCount;
            progress = curveFunc(progress);

            let blurValue;
            if (config.exponential) {
                blurValue = Math.pow(2, progress * 4) * 0.0625 * config.strength;
            } else {
                blurValue = 0.0625 * (progress * config.divCount + 1) * config.strength;
            }

            const p1 = Math.round((increment * i - increment) * 10) / 10;
            const p2 = Math.round(increment * i * 10) / 10;
            const p3 = Math.round((increment * i + increment) * 10) / 10;
            const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

            let gradient = `transparent ${p1}%, black ${p2}%`;
            if (p3 <= 100) gradient += `, black ${p3}%`;
            if (p4 <= 100) gradient += `, transparent ${p4}%`;

            const mask = `linear-gradient(${direction}, ${gradient})`;

            Object.assign(div.style, {
                position: 'absolute',
                inset: '0',
                maskImage: mask,
                WebkitMaskImage: mask,
                backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
                WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
                opacity: config.opacity
            });

            inner.appendChild(div);
        }

        document.body.appendChild(container);
        return container;
    }

    return { init };
})();
