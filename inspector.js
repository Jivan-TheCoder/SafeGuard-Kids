/**
 * SafeGuard Precision Inspector (v1.5) - "Precision Ghost Mode"
 * Full-width subtle bands with dashed edges for perfect alignment.
 * NEW: Click labels to copy CSS properties to clipboard.
 */
(function() {
    let isActive = false;
    let overlayContainer = null;

    function toggleInspector() {
        isActive = !isActive;
        if (isActive) activate();
        else deactivate();
    }

    function activate() {
        document.body.classList.add('inspector-active');
        renderOverlays();
        window.addEventListener('resize', renderOverlays);
    }

    function deactivate() {
        document.body.classList.remove('inspector-active');
        if (overlayContainer) {
            overlayContainer.remove();
            overlayContainer = null;
        }
        window.removeEventListener('resize', renderOverlays);
    }

    function renderOverlays() {
        if (overlayContainer) overlayContainer.remove();
        overlayContainer = document.createElement('div');
        overlayContainer.id = 'sg-inspector-root';
        document.body.appendChild(overlayContainer);

        const targets = document.querySelectorAll('section, footer');
        targets.forEach((el, index) => {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Padding Top (Purple)
            const pt = parseFloat(style.paddingTop);
            if (pt > 0) createFullOverlay(rect.top + scrollTop, pt, `S${index} Pad-T: ${pxToRem(pt)} rem`, 'padding');

            // Padding Bottom (Purple)
            const pb = parseFloat(style.paddingBottom);
            if (pb > 0) createFullOverlay(rect.bottom + scrollTop - pb, pb, `S${index} Pad-B: ${pxToRem(pb)} rem`, 'padding');

            // Margin Top (Orange)
            const mt = parseFloat(style.marginTop);
            if (mt > 0) createFullOverlay(rect.top + scrollTop - mt, mt, `S${index} Mar-T: ${pxToRem(mt)} rem`, 'margin');

            // Margin Bottom (Orange)
            const mb = parseFloat(style.marginBottom);
            if (mb > 0) createFullOverlay(rect.bottom + scrollTop, mb, `S${index} Mar-B: ${pxToRem(mb)} rem`, 'margin');
        });
    }

    function createFullOverlay(top, height, labelText, type) {
        const overlay = document.createElement('div');
        overlay.className = `sg-full-overlay sg-type-${type}`;
        overlay.style.top = `${top}px`;
        overlay.style.height = `${height}px`;

        const label = document.createElement('div');
        label.className = `sg-full-label sg-label-type-${type}`;
        label.style.cursor = 'copy';
        label.title = 'Click to copy CSS';
        label.innerText = labelText;
        
        // Click to copy functionality (with file:// protocol fallback)
        label.onclick = (e) => {
            e.stopPropagation();
            const cssProp = getCSSProperty(labelText);
            
            const success = () => {
                const originalText = label.innerText;
                label.innerText = 'Copied!';
                label.style.background = '#10B981';
                setTimeout(() => {
                    label.innerText = originalText;
                    label.style.background = '';
                }, 800);
            };

            if (navigator.clipboard) {
                navigator.clipboard.writeText(cssProp).then(success);
            } else {
                // Fallback for file:// protocol
                const textarea = document.createElement('textarea');
                textarea.value = cssProp;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    success();
                } catch (err) {
                    console.error('Copy failed', err);
                }
                document.body.removeChild(textarea);
            }
        };

        overlay.appendChild(label);
        overlayContainer.appendChild(overlay);
    }

    function getCSSProperty(text) {
        // Extracts "padding-top: Xrem;" from "S2 Pad-T: X.XX rem"
        const parts = text.split(':');
        const keyMap = { 'Pad-T': 'padding-top', 'Pad-B': 'padding-bottom', 'Mar-T': 'margin-top', 'Mar-B': 'margin-bottom' };
        for (const [key, prop] of Object.entries(keyMap)) {
            if (parts[0].includes(key)) return `${prop}: ${parts[1].trim()};`;
        }
        return text;
    }

    function pxToRem(px) { return (px / 16).toFixed(2); }

    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && e.code === 'KeyS') {
            e.preventDefault();
            toggleInspector();
        }
    });

    console.log('SafeGuard Precision Inspector (V1.3) - Full Ghost Mode Loaded.');
})();
