/**
 * CONFIGURACIÓN GLOBAL DEL DASHBOARD
 * Centraliza el comportamiento, la estética y los tiempos del sistema.
 */
export const CONFIG = {
    // --- TIEMPOS Y RETARDOS ---
    EXPIRATION_MS: 10000,      // Tiempo de vida de los mensajes (10 seg)
    TYPING_DELAY: 1500,        // Tiempo que persiste el indicador de "escribiendo"
    LOADER_SIMULATION: 800,    // Delay artificial para que el spinner sea visible
    
    // --- ESTÉTICA Y COLORES ---
    // Usamos variables de cadena para inyectarlas dinámicamente si es necesario
    COLORS: {
        PRIMARY_HSL: '34, 87%, 45%',       // El tono naranja para elementos clave
        ACCENT_OKLCH: '0.76 0.24 145',     // El verde neón para acentos de alta gama
        GLASS_OPACITY: '0.05',             // Transparencia base de los paneles
    },

    // --- PALETA DE TEMAS ---
    THEMES: {
        dark: {
            name: 'Oscuro Profundo',
            bg: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
            panel: 'rgba(255, 255, 255, 0.05)',
            text: '#ffffff',
            border: 'rgba(255, 255, 255, 0.1)'
        },
        light: {
            name: 'Cristal Claro',
            bg: 'linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%)',
            panel: 'rgba(255, 255, 255, 0.4)',
            text: '#1a1a1a',
            border: 'rgba(0, 0, 0, 0.05)'
        }
    },

    // --- CONFIGURACIÓN DE AUDIO ---
    AUDIO: {
        NOTIF_FREQ: 1760,      // Frecuencia del ping (La6)
        DISINT_DURATION: 0.6,  // Debe coincidir con la animación CSS (segundos)
        MASTER_VOLUME: 0.1     // Nivel de ganancia general
    },

    // --- CONFIGURACIÓN DE NOTIFICACIONES ---
    NOTIFICATIONS: {
        ICON: 'https://cdn-icons-png.flaticon.com/512/733/733585.png',
        APP_NAME: 'Glass Chat Pro'
    }
};

/**
 * Nota: Los colores HSL y OKLCH se definen sin la función envolvente 
 * para poder manipular su opacidad dinámicamente en el CSS o JS.
 */