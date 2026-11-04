import { VORTEX_CONFIG } from './vortex-config.js';

export class VorteXQuotes {
    static generateHTML(quoteData) {
        if (!quoteData || quoteData.action !== 'quote') return '';
        const typeConfig = VORTEX_CONFIG.PRICING.types[quoteData.type] || VORTEX_CONFIG.PRICING.types['custom'];
        let total = typeConfig.price;
        let featuresHTML = '';
        if (quoteData.features && Array.isArray(quoteData.features)) {
            quoteData.features.forEach(fKey => {
                const feat = VORTEX_CONFIG.PRICING.features[fKey];
                if (feat) { featuresHTML += `<div class="vortex-quote-row"><span>+ ${feat.label}</span><span>$${feat.price} USD</span></div>`; total += feat.price; }
            });
        }
        let hostingHTML = '';
        if (quoteData.hosting) {
            const host = VORTEX_CONFIG.PRICING.hosting[quoteData.hosting];
            if (host) { hostingHTML = `<div class="vortex-quote-row"><span>+ ${host.label}</span><span>$${host.price} USD</span></div>`; total += host.price; }
        }
        const id = 'quote-' + Date.now();
        return `
        <div class="vortex-quote-card" id="${id}">
            <div class="vortex-quote-header">Estimación de Proyecto</div>
            <div class="vortex-quote-row font-bold text-white mb-2"><span>${typeConfig.label}</span><span>$${typeConfig.price} USD</span></div>
            ${featuresHTML}${hostingHTML}
            <div class="vortex-quote-total"><span>Total Estimado:</span><span>$${total} USD</span></div>
            <div class="vortex-quote-disclaimer">* Cotización orientativa. El precio final debe confirmarse con CURRIS.SITE.</div>
            <button onclick="navigator.clipboard.writeText(document.getElementById('${id}').innerText); alert('Copiado al portapapeles');" class="mt-3 w-full bg-white/5 border border-white/10 text-[#00FFFF] text-xs py-2 rounded-lg hover:bg-white/10 transition">Copiar Cotización</button>
        </div>`;
    }
}
