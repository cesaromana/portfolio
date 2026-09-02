# Portafolio

Página personal. Papel crema, dos tintas, viñetas de cómic. React + TypeScript + Vite, CSS propio, sin Tailwind. Español por defecto, inglés con un clic.

## Correr

```bash
npm install
cp .env.example .env     # opcional, ver abajo
npm run dev              # desarrollo (Vite en :5173, /api y /peer van al servidor propio si está corriendo)
npm start                # producción: build + servidor propio en :3000
```

El servidor propio (`server/index.js`) sirve el build, la señalización WebRTC de PeerJS en `/peer` y las dos APIs. Para que el teléfono se conecte desde fuera hace falta HTTPS (iOS no da acceso al giroscopio sin HTTPS): un reverse proxy (Caddy o nginx) delante del puerto 3000 con certificado, y `VITE_PEER_SELF=1` en `.env` antes de hacer el build.

## Mapa

- `src/sections/` — una viñeta por archivo: Hero, Projects, Experience, Play, Stack, About (Films, Music, Manga, Anime, Sonic, Spidey, Oikawa), Colophon.
- `src/games/` — los tres juegos del mando (fruta, carretera, tiro al blanco), el lienzo y el bus de entrada (teléfono, mouse, dedo, gamepad).
- `src/control/` — el teléfono como mando: `session.ts` (PC), `phone/` (móvil), `calibration.ts`, `pointer-*.ts`, `protocol.ts`.
- `src/i18n/` — idioma. Los textos de interfaz están en `strings.ts`; el contenido largo vive en `src/data/` con el formato `{ es, en }`.
- `src/data/` — todo el contenido editable: perfil, proyectos, experiencia, películas, música, mangas, animes, series, herramientas.
- `public/sonic/` — Open Sonic JS (MIT), alojado aquí mismo para poder inyectarle controles táctiles.
- `api/` + `server/` — Letterboxd (RSS) y Spotify ("sonando ahora"). Ambos opcionales, ver `.env.example`.

## Cómo funciona el mando

1. La PC abre un Peer y muestra un QR con `/control?id=…`.
2. El teléfono abre esa URL, pide permiso de orientación (iOS lo exige desde un gesto) y conecta por WebRTC.
3. Calibración: 15 bloques de 200 ms con el teléfono quieto. Si se mueve, retrocede.
4. Listo: la orientación relativa a la línea base mueve una retícula. En el teléfono aparecen A y B; deslizar arriba/abajo cambia de sección. Los juegos leen el mismo puntero y los botones.

Bluetooth directo teléfono→PC no es posible desde un navegador: la Web Bluetooth API solo deja al navegador actuar como central, nunca como periférico. WebRTC da la misma sensación sin instalar nada. Un gamepad Bluetooth emparejado a la PC sí funciona con los juegos (Gamepad API).
