/**
 * Per-tier show/hide for .stotra-container pages (Devanagari, Kannada, IAST, translation).
 * Loaded only on stotra tier HTML pages; idempotent init.
 */
(function () {
    const TIER_IDS = ['devanagari', 'kannada', 'iast', 'translation'];
    const DEFAULT_ON = new Set(['devanagari']);

    function setTierVisible(container, tier, visible) {
        container.querySelectorAll(`.tier.${tier}`).forEach((el) => {
            el.classList.toggle('tier-visible', visible);
        });
        const btn = document.querySelector(`.tier-toggle-btn[data-tier="${tier}"]`);
        if (btn) {
            btn.classList.toggle('active', visible);
            btn.setAttribute('aria-pressed', visible ? 'true' : 'false');
        }
    }

    function initStotraTierToggles() {
        if (window.__stotraTiersInitialized) {
            return;
        }

        const container = document.querySelector('.stotra-container');
        const bar = document.querySelector('.stotra-tier-buttons');
        if (!container || !bar) {
            return;
        }

        window.__stotraTiersInitialized = true;
        container.classList.add('stotra-tiers-initialized');

        TIER_IDS.forEach((tier) => {
            setTierVisible(container, tier, DEFAULT_ON.has(tier));
        });

        bar.addEventListener('click', (event) => {
            const btn = event.target.closest('.tier-toggle-btn');
            if (!btn || !bar.contains(btn)) {
                return;
            }
            const tier = btn.getAttribute('data-tier');
            if (!tier || !TIER_IDS.includes(tier)) {
                return;
            }
            const sample = container.querySelector(`.tier.${tier}`);
            const isVisible = sample?.classList.contains('tier-visible') ?? false;
            setTierVisible(container, tier, !isVisible);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStotraTierToggles);
    } else {
        initStotraTierToggles();
    }
})();
