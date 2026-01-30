import { CONFIG } from './config.js';
import { StorageManager } from './storage-manager.js';
import { ChatEngine } from './chat-engine.js';
import { UIEffects, NotificationManager } from './ui-effects.js';
import { AudioEngine } from './audio-engine.js';

/**
 * NÚCLEO OPERATIVO DEL DASHBOARD
 * Maneja eventos, sincronización de usuarios y ciclo de vida de datos.
 */

// 1. Estado Inicial
let messages = StorageManager.load();
const typingTimers = {};

/**
 * Actualiza la interfaz en ambos paneles y persiste los datos.
 */
const syncUI = () => {
    UIEffects.render(messages, 1);
    UIEffects.render(messages, 2);
    StorageManager.save(messages);
};

/**
 * Procesa el envío de un nuevo mensaje.
 */
const onSendMessage = async (senderId, content, isImage = false) => {
    const newMessage = ChatEngine.createMessage(senderId, content, isImage);
    
    if (newMessage) {
        messages.push(newMessage);
        syncUI();
        
        // Feedback auditivo
        AudioEngine.playNotification();

        // Notificación de escritorio si la pestaña no es visible
        if (document.visibilityState !== "visible") {
            const preview = isImage ? "📷 Envió una imagen" : content;
            NotificationManager.send(`Usuario ${senderId}`, preview);
        }

        // Programar autodestrucción automática
        setTimeout(() => {
            messages = messages.filter(m => m.id !== newMessage.id);
            syncUI();
        }, CONFIG.EXPIRATION_MS);
    }
};

/**
 * Configuración de Eventos para Paneles Duales
 */
[1, 2].forEach(id => {
    const input = document.getElementById(`input${id}`);
    const sendBtn = document.getElementById(`send${id}`);
    const fileInput = document.getElementById(`file${id}`);
    const panel = document.getElementById(`user${id}`);

    // --- Envío de Texto ---
    sendBtn.onclick = () => {
        if (input.value.trim()) {
            onSendMessage(id, input.value);
            input.value = '';
            UIEffects.showTyping(id === 1 ? 2 : 1, false);
        }
    };

    input.onkeypress = (e) => {
        if (e.key === 'Enter') sendBtn.click();
    };

    // --- Indicador de Escritura ---
    input.oninput = () => {
        const otherUserId = id === 1 ? 2 : 1;
        UIEffects.showTyping(otherUserId, true);
        
        clearTimeout(typingTimers[id]);
        typingTimers[id] = setTimeout(() => {
            UIEffects.showTyping(otherUserId, false);
        }, CONFIG.TYPING_DELAY);
    };

    // --- Gestión de Archivos (📎 Botón) ---
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            UIEffects.toggleLoader(id, true);
            try {
                const base64 = await ChatEngine.processImage(file);
                // Delay artificial para suavidad visual (Spinner)
                setTimeout(() => {
                    onSendMessage(id, base64, true);
                    UIEffects.toggleLoader(id, false);
                }, CONFIG.LOADER_SIMULATION);
            } catch (err) {
                console.error(err);
                UIEffects.toggleLoader(id, false);
            }
        }
    };

    // --- Gestión de Archivos (Drag & Drop) ---
    panel.ondragover = (e) => {
        e.preventDefault();
        UIEffects.setDragOver(id, true);
    };

    panel.ondragleave = () => UIEffects.setDragOver(id, false);

    panel.ondrop = async (e) => {
        e.preventDefault();
        UIEffects.setDragOver(id, false);
        const file = e.dataTransfer.files[0];
        
        if (file?.type.startsWith('image/')) {
            UIEffects.toggleLoader(id, true);
            const base64 = await ChatEngine.processImage(file);
            onSendMessage(id, base64, true);
            UIEffects.toggleLoader(id, false);
        }
    };
});

/**
 * Acción de Borrado Masivo con Animación
 */
document.querySelectorAll('.delete-all').forEach(btn => {
    btn.onclick = async () => {
        // 1. Audio de desintegración
        AudioEngine.playDisintegrate();
        
        // 2. Animación visual en cascada
        await Promise.all([
            UIEffects.animateClear(1),
            UIEffects.animateClear(2)
        ]);
        
        // 3. Limpiar estado y persistencia
        messages = [];
        StorageManager.clear();
        syncUI();
    };
});

// Inicialización de la App
const initApp = () => {
    NotificationManager.requestPermission();
    syncUI();
    console.log("🚀 Glass Dashboard iniciado correctamente.");
};

document.addEventListener('DOMContentLoaded', initApp);