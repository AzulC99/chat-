import { CONFIG } from './config.js';

/**
 * GESTOR DE ALMACENAMIENTO (LocalStorage)
 * Maneja la persistencia de datos y la limpieza de mensajes expirados.
 */
export const StorageManager = {
    
    // Clave única para evitar conflictos con otras aplicaciones
    DB_KEY: 'glass_chat_v1',

    /**
     * Guarda el estado actual de los mensajes en el navegador.
     * @param {Array} messages - Lista completa de mensajes activos.
     */
    save(messages) {
        try {
            const data = JSON.stringify(messages);
            localStorage.setItem(this.DB_KEY, data);
        } catch (error) {
            console.error("Error al guardar en LocalStorage:", error);
        }
    },

    /**
     * Recupera los mensajes guardados y filtra los que ya han caducado.
     * @returns {Array} Mensajes válidos para mostrar.
     */
    load() {
        try {
            const rawData = localStorage.getItem(this.DB_KEY);
            if (!rawData) return [];

            const messages = JSON.parse(rawData);
            const now = Date.now();

            // Retornamos solo los mensajes que aún no cumplen su tiempo de vida
            return messages.filter(msg => {
                const age = now - msg.timestamp;
                return age < CONFIG.EXPIRATION_MS;
            });
        } catch (error) {
            console.warn("Datos de almacenamiento corruptos, iniciando vacío.");
            return [];
        }
    },

    /**
     * Elimina todos los datos de la aplicación del almacenamiento.
     */
    clear() {
        localStorage.removeItem(this.DB_KEY);
    },

    /**
     * Verifica cuánto espacio (en caracteres) está ocupando el chat.
     * Útil para monitorear el límite de LocalStorage (aprox. 5MB).
     */
    getStorageSize() {
        const rawData = localStorage.getItem(this.DB_KEY) || "";
        return (rawData.length * 2) / 1024; // Tamaño aproximado en KB
    }
};