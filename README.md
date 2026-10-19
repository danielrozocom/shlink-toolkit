# 🚀 Shlink Toolkit (Tampermonkey Userscript)

Un userscript para mejorar y potenciar la interfaz web oficial de [Shlink](https://app.shlink.io/).

[![Instalar Userscript](https://img.shields.io/badge/Instalar%20con-Tampermonkey-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://raw.githubusercontent.com/danielrozocom/shlink-toolkit/main/shlink-toolkit.user.js)
[![Versión](https://img.shields.io/badge/version-1.6-blue?style=for-the-badge)](shlink-toolkit.user.js)
[![Autor](https://img.shields.io/badge/autor-Daniel%20Rozo-orange?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.danielrozo.com)

---

## ⚡ Instalación Rápida (1 Clic)

1. Asegúrate de tener instalada la extensión **[Tampermonkey](https://www.tampermonkey.net/)** (o Violentmonkey / Greasemonkey) en tu navegador.
2. Haz clic en el botón o enlace de instalación directa:
   👉 **[Instalar `shlink-toolkit.user.js`](https://raw.githubusercontent.com/danielrozocom/shlink-toolkit/main/shlink-toolkit.user.js)**
3. Tampermonkey detectará automáticamente el archivo `.user.js`. Pulsa **"Instalar"**.
4. ¡Listo! Al abrir [app.shlink.io](https://app.shlink.io/) el script se ejecutará de inmediato.

---

## ✨ Características Principales

- 🔄 **Carga masiva sin paginación:** Intercepta las peticiones REST (`/rest/v3/short-urls`) para solicitar hasta 1000 elementos por página (`itemsPerPage=1000`), permitiéndote ver y filtrar todos tus enlaces en una sola vista.
- 🕒 **Formato de Fecha y Hora Estandarizado:** Convierte y unifica las fechas de creación y timestamps al formato legible `DD/MMM/YYYY HH:mm a. m./p. m.` con meses en español (`ENE`, `FEB`, `MAR`, etc.).
- ⚡ **Detección Dinámica y Reactiva:** Utiliza `MutationObserver` junto con hooks al ciclo de vida del DOM (`document-start`, `DOMContentLoaded`, `load`) para formatear fechas automáticamente cuando la vista se actualiza o se cargan nuevos enlaces vía AJAX.

---

## 🛠️ Archivos del Repositorio

- [`shlink-toolkit.user.js`](shlink-toolkit.user.js) — Código fuente del userscript.
- `README.md` — Guía de instalación y uso.

---

## 👤 Autor

**Daniel Josue Rozo Vargas**  
Sitio Web: [www.danielrozo.com](https://www.danielrozo.com)
