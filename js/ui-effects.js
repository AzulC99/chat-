import { CONFIG } from './config.js';

/**
 * MOTOR DE EFECTOS E INTERFAZ (UI)
 * Gestiona el DOM, animaciones y notificaciones nativas.
 */
export const UIEffects = {

    /**
     * Renderiza la lista de mensajes en un panel específico.
     */
    render(messages, userId) {
        const display = document.getElementById(`display${userId}`);
        if (!display) return;

        display.innerHTML = messages.map(m => `
            <div class="msg ${m.sender === userId ? 'sent' : 'received'}" id="${m.id}">
                <div class="msg-content">
                    ${m.isImage ? `<img src="${m.content}" class="chat-img" loading="lazy">` : m.content}
                </div>
                <div class="timer-bar" style="animation-duration: ${CONFIG.EXPIRATION_MS}ms"></div>
            </div>
        `).join('');

        // Scroll automático al último mensaje con suavidad
        display.scrollTo({ top: display.scrollHeight, behavior: 'smooth' });
    },

    /**
     * Aplica animación de desintegración (partículas) a todos los mensajes.
     */
    async animateClear(userId) {
        const messages = document.querySelectorAll(`#display${userId} .msg`);
        const animations = Array.from(messages).map((msg, i) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    msg.classList.add('disintegrate');
                    msg.addEventListener('animationend', resolve, { once: true });
                }, i * 50); // Efecto cascada
            });
        });
        return Promise.all(animations);
    },

    /**
     * Controla el indicador de "Escribiendo..."
     */
    showTyping(userId, show) {
        const el = document.getElementById(`typing${userId}`);
        if (el) el.style.opacity = show ? '1' : '0';
    },

    /**
     * Gestiona el Spinner de carga para procesamiento de imágenes.
     */
    toggleLoader(userId, show) {
        const panel = document.getElementById(`user${userId}`);
        let loader = panel.querySelector('.loader-container');

        if (!loader && show) {
            loader = document.createElement('div');
            loader.className = 'loader-container';
            loader.innerHTML = `
                <div class="glass-spinner"></div>
                <div class="loader-text">Procesando...</div>
            `;
            panel.appendChild(loader);
        }

        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
            panel.querySelector('.chat-area').style.filter = show ? 'blur(4px)' : 'none';
        }
    },

    /**
     * Feedback visual para el Drag & Drop.
     */
    setDragOver(userId, active) {
        const panel = document.getElementById(`user${userId}`);
        if (active) {
            panel.classList.add('drag-active');
            panel.style.borderColor = CONFIG.COLORS.ACCENT_OKLCH;
        } else {
            panel.classList.remove('drag-active');
            panel.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    }
};

/**
 * GESTOR DE NOTIFICACIONES NATIVAS
 */
export const NotificationManager = {
    async requestPermission() {
        if ("Notification" in window && Notification.permission !== "granted") {
            await Notification.requestPermission();
        }
    },

    send(title, body) {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, {
                body,
                icon: CONFIG.NOTIFICATIONS.ICON,
                silent: true // Usamos AudioEngine para el sonido personalizado
            });
        }
    }
};