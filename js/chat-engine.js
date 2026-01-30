import { CONFIG } from './config.js';

/**
 * MOTOR DE LÓGICA DE CHAT
 * Gestiona la creación de mensajes, procesamiento de archivos y validaciones.
 */
export const ChatEngine = {
    
    /**
     * Crea un objeto de mensaje estandarizado.
     * Utiliza crypto.randomUUID() para asegurar identificadores únicos.
     */
    createMessage(senderId, content, isImage = false) {
        if (!content || content.trim() === '') return null;

        return {
            id: crypto.randomUUID(),
            sender: senderId,
            content: content,
            timestamp: Date.now(),
            isImage: isImage,
            // Calculamos la expiración para referencia lógica
            expiresAt: Date.now() + CONFIG.EXPIRATION_MS
        };
    },

    /**
     * Convierte un objeto File (de input o drag & drop) a una cadena Base64.
     * Maneja la lectura de forma asíncrona mediante Promesas.
     */
    processImage(file) {
        return new Promise((resolve, reject) => {
            // Validación básica de tipo
            if (!file.type.startsWith('image/')) {
                return reject('El archivo debe ser una imagen (PNG, JPG, GIF).');
            }

            // Validación de tamaño (opcional, ej: 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                return reject('La imagen es demasiado pesada (Máx 5MB).');
            }

            const reader = new FileReader();
            
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject('Error al leer el archivo.');
            
            reader.readAsDataURL(file);
        });
    },

    /**
     * Filtra una lista de mensajes eliminando los que han superado el tiempo de vida.
     */
    filterExpired(messages) {
        const now = Date.now();
        return messages.filter(msg => (now - msg.timestamp) < CONFIG.EXPIRATION_MS);
    },

    /**
     * Genera un resumen de metadatos del chat (opcional para estadísticas).
     */
    getChatStats(messages) {
        return {
            total: messages.length,
            images: messages.filter(m => m.isImage).length,
            lastUpdate: new Date().toLocaleTimeString()
        };
    }
};