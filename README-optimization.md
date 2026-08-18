Optimización de `landing-lcl` — instrucciones de build

Recomendaciones aplicadas automáticamente:
- Añadido `font-display: swap` para Material Symbols.
- Preload del LCP image y uso de `<picture>` con fuentes WebP.
- Añadido `width`/`height`, `loading` y `fetchpriority` a imagen hero y logos.
- `assets/js/main.js` cargado con `defer`.

Pasos adicionales (automáticos si ejecutas el build):
1) Instala dependencias (dev):

   npm install

2) Genera versiones WebP y variantes responsive, y minifica CSS/JS:

   npm run build

   - `build:images` usa `sharp` para crear WebP y variantes.
   - `minify:css` produce `assets/css/style.min.css`.
   - `minify:js` produce `assets/js/main.min.js`.

3) Reemplaza referencias en `index.html` (opcional):
   - Puedes cambiar manualmente `assets/css/style.css` por `assets/css/style.min.css` y
     `assets/js/main.js` por `assets/js/main.min.js` tras verificar que los archivos existen.

Notas y recomendaciones del servidor:
- Servir imágenes y archivos estáticos con `Cache-Control: public, max-age=31536000, immutable`.
- Habilitar Brotli o gzip en el servidor.
- Considerar self-hosting de Google Fonts con `@font-face` y `preload`.

Si quieres, puedo:
- Ejecutar `git add/commit/push` con estos cambios.
- Generar `@font-face` y descargar los woff2 necesarios (necesita que ejecutes `npm install` localmente o me des permiso para hacerlo).
