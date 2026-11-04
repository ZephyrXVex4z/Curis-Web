import { VORTEX_CONFIG, SYSTEM_INSTRUCTIONS } from './vortex-config.js';
import { VorteXQuotes } from './vortex-quotes.js';

class VorteXAssistant {
    constructor() {
        this.fab = document.getElementById('vortex-fab');
        this.window = document.getElementById('vortex-window');
        this.closeBtn = document.getElementById('vortex-close');
        this.clearBtn = document.getElementById('vortex-clear');
        this.form = document.getElementById('vortex-form');
        this.input = document.getElementById('vortex-input');
        this.messagesContainer = document.getElementById('vortex-messages');
        this.suggestionsContainer = document.getElementById('vortex-suggestions');
        this.history = [];
        this.isProcessing = false;
        
        this.init();
    }

    init() {
        this.loadSession();
        this.bindEvents();
        if (this.history.length === 0) {
            this.appendMessage('assistant', "¡Hola! Soy **VorteX**, tu asesor inteligente. 🌌\n\n¿En qué puedo ayudarte con tu proyecto web?");
            this.renderSuggestions(["Quiero crear una web", "¿Qué alojamiento recomiendas?", "Cotizar proyecto", "Tienda online"]);
        } else {
            this.renderHistory();
        }
    }

    bindEvents() {
        this.fab.addEventListener('click', () => this.window.classList.toggle('vortex-open'));
        this.closeBtn.addEventListener('click', () => this.window.classList.remove('vortex-open'));
        this.clearBtn.addEventListener('click', () => {
            if(confirm('¿Borrar historial?')) {
                this.history = []; sessionStorage.removeItem('vortex_history');
                this.messagesContainer.innerHTML = ''; this.init();
            }
        });
        this.input.addEventListener('input', () => { this.input.style.height = 'auto'; this.input.style.height = Math.min(this.input.scrollHeight, 128) + 'px'; });
        this.input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.form.dispatchEvent(new Event('submit')); }});
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    loadSession() { const saved = sessionStorage.getItem('vortex_history'); if (saved) { try { this.history = JSON.parse(saved); } catch(e) { this.history = []; } } }
    saveSession() { sessionStorage.setItem('vortex_history', JSON.stringify(this.history)); }

    renderSuggestions(suggestions) {
        this.suggestionsContainer.innerHTML = suggestions.map(text => 
            `<button class="whitespace-nowrap px-3 py-1.5 rounded-full border border-[#8A2BE2]/30 bg-[#8A2BE2]/10 text-[#00FFFF] text-xs hover:bg-[#8A2BE2]/20 transition suggestion-btn">${text}</button>`
        ).join('');
        this.suggestionsContainer.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => { this.input.value = btn.textContent; this.form.dispatchEvent(new Event('submit')); this.suggestionsContainer.innerHTML = ''; });
        });
    }

    parseTextAndJSON(text) {
        let cleanText = text;
        let quoteHTML = '';
        const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = text.match(jsonRegex);
        if (match && match[1]) {
            try {
                const quoteData = JSON.parse(match[1]);
                if (quoteData.action === 'quote') {
                    cleanText = cleanText.replace(jsonRegex, '').trim();
                    quoteHTML = VorteXQuotes.generateHTML(quoteData);
                }
            } catch (e) {}
        }
        cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>').replace(/^# (.*$)/gim, '<h1>$1</h1>');
        return `<div class="vortex-md">${cleanText}</div>` + quoteHTML;
    }

    appendMessage(role, text, save = false) {
        const div = document.createElement('div');
        div.className = `flex gap-3 ${role === 'user' ? 'justify-end' : ''} mb-4`;
        
        let avatar = role === 'user' ? '' : `<div class="w-8 h-8 rounded-full flex-shrink-0 bg-[#05080f] flex items-center justify-center border border-[#8A2BE2]/30"><img src="assets/images/vortex-logo.svg" class="w-5 h-5"></div>`;
        let contentClass = role === 'user' ? 'bg-[#8A2BE2] text-white rounded-2xl rounded-tr-sm' : 'bg-[#0a0f1a] border border-white/5 text-gray-200 rounded-2xl rounded-tl-sm';
        
        div.innerHTML = `${avatar}<div class="${contentClass} text-sm p-3 max-w-[85%] shadow-md">${role === 'user' ? text : this.parseTextAndJSON(text)}</div>`;
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        if (save) {
            this.history.push({ role: role === 'user' ? 'user' : 'model', parts: [{ text: text }] });
            this.saveSession();
        }
    }

    renderHistory() { this.messagesContainer.innerHTML = ''; this.history.forEach(msg => { this.appendMessage(msg.role === 'user' ? 'user' : 'assistant', msg.parts[0].text, false); }); }

    showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id; div.className = `flex gap-3 mb-4`;
        div.innerHTML = `<div class="w-8 h-8 rounded-full flex-shrink-0 bg-[#05080f] flex items-center justify-center border border-[#8A2BE2]/30"><img src="assets/images/vortex-logo.svg" class="w-5 h-5"></div>
            <div class="bg-[#0a0f1a] border border-white/5 p-4 rounded-2xl rounded-tl-sm flex items-center gap-1 shadow-md">
                <div class="w-2 h-2 bg-[#00FFFF] rounded-full vortex-typing-dot"></div><div class="w-2 h-2 bg-[#00FFFF] rounded-full vortex-typing-dot"></div><div class="w-2 h-2 bg-[#00FFFF] rounded-full vortex-typing-dot"></div>
            </div>`;
        this.messagesContainer.appendChild(div);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        return id;
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (this.isProcessing) return;
        const text = this.input.value.trim();
        if (!text) return;

        if (VORTEX_CONFIG.API_KEY === "TU_API_KEY_AQUI") { alert("Configura tu API Key en js/vortex-config.js"); return; }

        this.input.value = ''; this.input.style.height = 'auto'; this.suggestionsContainer.innerHTML = '';
        this.appendMessage('user', text, true);
        const typingId = this.showTypingIndicator();
        this.isProcessing = true;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${VORTEX_CONFIG.MODEL}:generateContent?key=${VORTEX_CONFIG.API_KEY}`;
            const payload = { system_instruction: { parts: [{ text: SYSTEM_INSTRUCTIONS }] }, contents: this.history, generationConfig: { temperature: 0.5, maxOutputTokens: 800 } };
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await response.json();
            document.getElementById(typingId).remove();
            if (!response.ok) throw new Error(data.error?.message || "Error API");
            this.appendMessage('assistant', data.candidates[0].content.parts[0].text, true);
        } catch (error) {
            document.getElementById(typingId)?.remove();
            this.appendMessage('assistant', "Hubo un error de red. Revisa tu consola o tu API Key.");
            this.history.pop(); this.saveSession();
        } finally {
            this.isProcessing = false;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => { window.vortexApp = new VorteXAssistant(); });
