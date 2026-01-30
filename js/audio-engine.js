import { CONFIG } from './config.js';

/**
 * MOTOR DE AUDIO SINTÉTICO
 * Genera feedback sonoro mediante la Web Audio API para máxima ligereza y 0 latencia.
 */
export const AudioEngine = {
    ctx: null,

    /**
     * Inicializa el AudioContext. 
     * Nota: Debe llamarse tras una interacción del usuario (clic/tecla).
     */
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    /**
     * Notificación "Crystal Ping"
     * Sonido agudo y puro para la llegada de mensajes.
     */
    playNotification() {
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Configuración de tono (Onda senoidal para pureza)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(CONFIG.AUDIO.NOTIF_FREQ, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

        // Envolvente de amplitud (Ataque rápido, decaimiento suave)
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(CONFIG.AUDIO.MASTER_VOLUME, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
    },

    /**
     * Efecto "Dissolve Sweep"
     * Ruido blanco filtrado para la animación de desintegración de mensajes.
     */
    playDisintegrate() {
        this.init();
        const now = this.ctx.currentTime;
        const duration = CONFIG.AUDIO.DISINT_DURATION;

        // Crear Buffer de Ruido Blanco (simula partículas/arena)
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Filtro de paso bajo dinámico (el sonido se vuelve más "oscuro" al final)
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, now);
        filter.frequency.exponentialRampToValueAtTime(20, now + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(CONFIG.AUDIO.MASTER_VOLUME, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + duration);
    }
};