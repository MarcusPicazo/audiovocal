# Marcus Escalona — Audio Engineer Portfolio

Sitio portafolio bilingüe (ES/EN) para Marcus Escalona, ingeniero de audio especializado en mezcla, masterización, doblaje y producción de podcasts.

## Contenido

- `index.html` — estructura del sitio (una sola página).
- `css/style.css` — estilos.
- `js/i18n.js` — diccionario y lógica de cambio de idioma ES/EN.
- `js/webgl-bg.js` — fondo animado con Three.js (partículas tipo waveform).
- `js/player.js` — reproductor de audio personalizado (play/pausa, avance/retroceso 10s, barra de progreso, descarga).
- `js/main.js` — menú móvil, scroll, animaciones de entrada.
- `assets/img/` — fotografías (retrato y estudio).
- `assets/audio/` — muestras de audio reproducibles/descargables.

## Agregar más muestras de audio

El reproductor soporta cualquier cantidad de pistas. Para agregar una nueva:

1. Coloca el archivo `.mp3` en `assets/audio/` (por ejemplo `demo-02.mp3`).
2. Agrega una entrada en el arreglo `TRACKS` dentro de `js/player.js`:

```js
{
  file: "assets/audio/demo-02.mp3",
  titleEs: "Título en español",
  titleEn: "Title in English",
  tagEs: "Categoría",
  tagEn: "Category"
}
```

Actualmente el sitio incluye **1 muestra real** (`demo-01.mp3`). Se recomienda agregar 2 muestras adicionales antes de publicar en Netlify, tal como se planeó originalmente (3 audios de ejemplo).

## Despliegue en Netlify

Este es un sitio 100% estático (HTML/CSS/JS, sin build step). En Netlify:

- **Build command:** (dejar vacío)
- **Publish directory:** `.` (raíz del repositorio)

## Desarrollo local

Cualquier servidor estático funciona, por ejemplo:

```bash
npx serve .
```
