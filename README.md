# 💎 Glass Dashboard Pro: Dual-User Chat Engine
# 💎 Aprendizaje Google Gemini

Un dashboard de comunicación dual con estética **Glassmorphism**, diseñado para ofrecer una experiencia de usuario inmersiva mediante síntesis de audio, animaciones aceleradas por hardware y persistencia inteligente de datos.

## 🚀 Características Principales

* **Estética de Vanguardia:** Uso intensivo de `backdrop-filter` para efectos de vidrio y paleta de colores **OKLCH** para una fidelidad cromática superior.
* **Arquitectura Modular:** Separación estricta de responsabilidades (Audio, UI, Datos, Configuración) mediante **ES6 Modules**.
* **Audio Generativo:** Notificaciones y sonidos de desintegración sintetizados en tiempo real con la **Web Audio API** (sin archivos externos).
* **Persistencia y Autodestrucción:** Los mensajes se guardan en `localStorage` y se eliminan automáticamente tras 10 segundos para mantener la privacidad y el rendimiento.
* **Interacción Avanzada:** Soporte para **Drag & Drop** de imágenes, indicadores de escritura en tiempo real y notificaciones de escritorio nativas.

## 🛠️ Stack Tecnológico

* **Lenguaje:** JavaScript (Vanilla JS)
* **Estilos:** CSS3 (Variables, Flexbox, Keyframes, OKLCH)
* **Estructura:** HTML5 Semántico
* **APIs:** Web Audio API, Web Notifications, LocalStorage, File API.

## 📂 Estructura del Proyecto

```text
/
├── index.html              # Punto de entrada y estructura DOM
├── style.css               # Layout global y posicionamiento
├── css/
│   └── glass-fx.css        # Efectos de vidrio, spinners y animaciones
└── js/
    ├── config.js           # Single Source of Truth (Configuración)
    ├── main.js             # Orquestador y gestor de eventos
    ├── chat-engine.js      # Procesamiento de lógica y datos
    ├── audio-engine.js     # Sintetizador de sonido digital
    ├── storage-manager.js  # Capa de persistencia local
    └── ui-effects.js       # Renderizado y manipulación del DOM
