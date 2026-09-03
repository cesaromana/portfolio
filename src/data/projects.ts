import { bi, type Bi } from '../i18n/lang-context';

export type Project = {
  id: string;
  num: string;
  title: string | Bi;
  line: Bi;
  stack: string[];
  year: string;
  role: Bi;
  repo?: string;
  live?: string;
  story: Bi[];
  /** Qué tiene por dentro y con qué se conecta. */
  features: Bi[];
  hue: 'red' | 'blue';
};

export const projects: Project[] = [
  {
    id: 'recuerdos',
    num: '01',
    title: 'Recuerdos',
    line: bi(
      'Un calendario donde cada día guarda una foto, un lugar y la canción que sonaba.',
      'A calendar where every day holds a photo, a place and the song that was playing.',
    ),
    stack: ['React 19', 'TypeScript', 'Vite', 'PostgreSQL', 'Blob storage', 'Spotify', 'Google Maps', 'PWA'],
    year: '2025 → 2026',
    role: bi('Diseño, front, API y deploy', 'Design, front, API and deploy'),
    repo: 'https://github.com/cesaromana/Recuerdos',
    story: [
      bi(
        'Empezó como un diario con fecha y terminó siendo un archivo: cada recuerdo vive en un día del calendario, con su foto, su texto, el sitio donde pasó y la canción que sonaba. Abrir un día es abrir esa tarde.',
        'It started as a dated diary and ended up as an archive: every memory lives on a calendar day, with its photo, its text, the place it happened and the song that was playing. Opening a day is opening that afternoon.',
      ),
      bi(
        'Es una aplicación instalable: funciona como app en el teléfono, con sesión propia y todo el contenido protegido detrás del login.',
        'It is an installable app: it runs like a native one on the phone, with its own session and every bit of content behind the login.',
      ),
    ],
    features: [
      bi('Calendario mes a mes: cada día abre su recuerdo.', 'Month-by-month calendar: each day opens its memory.'),
      bi('Spotify: buscas la canción dentro de la app y queda pegada a la fecha.', 'Spotify: you search the song inside the app and it stays pinned to the date.'),
      bi('Google Maps: cada recuerdo guarda dónde pasó y se ve en un mapa.', 'Google Maps: every memory saves where it happened and shows on a map.'),
      bi('Fotos subidas a almacenamiento de objetos, no a la base de datos.', 'Photos uploaded to object storage, not into the database.'),
      bi('Buscador por texto y resumen por temporada.', 'Full-text search and a per-season summary.'),
      bi('“En un día como hoy”: te devuelve lo que hacías hace uno o tres años.', '“On this day”: brings back what you were doing one or three years ago.'),
      bi('Login con rutas protegidas y PWA instalable, con modo claro y oscuro.', 'Login with protected routes and an installable PWA, in light and dark.'),
    ],
    hue: 'red',
  },
  {
    id: 'gatos',
    num: '02',
    title: 'Gatos',
    line: bi('Página de mis gatos. Excusa oficial para aprender Tailwind.', 'A page for my cats. Official excuse to learn Tailwind.'),
    stack: ['React', 'TypeScript', 'Tailwind', 'styled-components', 'React Router'],
    year: '2025',
    role: bi('Todo, incluido el casting', 'Everything, casting included'),
    repo: 'https://github.com/cesaromana/gatos',
    story: [
      bi(
        'Una landing para gatos porque se la merecen: portada a pantalla completa, galería y una guía de razas con su temperamento.',
        'A landing page for cats because they deserve one: full-screen hero, gallery and a breed guide with temperament.',
      ),
      bi(
        'La hice para entender Tailwind de verdad y no solo copiar clases. Fue también mi primer trabajo serio de animación en CSS.',
        'I built it to really understand Tailwind instead of copying classes. It was also my first serious CSS animation work.',
      ),
    ],
    features: [
      bi('Galería con fotos propias y ficha de cada raza.', 'Gallery with my own photos and a card per breed.'),
      bi('Botones y tarjetas en neumorfismo, hechos a mano.', 'Hand-made neumorphic buttons and cards.'),
      bi('Ruta escondida /chismoso: un televisor CRT dibujado solo con CSS.', 'Hidden /chismoso route: a CRT television drawn in pure CSS.'),
      bi('Navegación con React Router y despliegue estático.', 'React Router navigation and a static deploy.'),
    ],
    hue: 'blue',
  },
  {
    id: 'n8n',
    num: '03',
    title: bi('Asistente de calendario', 'Calendar assistant'),
    line: bi(
      'Le escribes por WhatsApp, o le mandas un audio, y aparece en tu Google Calendar.',
      'You text it on WhatsApp, or send a voice note, and it shows up in your Google Calendar.',
    ),
    stack: ['n8n', 'Evolution API', 'Docker Compose', 'PostgreSQL', 'Redis', 'Google Calendar', 'AI agent'],
    year: '2025',
    role: bi('Infraestructura y flujos', 'Infrastructure and flows'),
    repo: 'https://github.com/cesaromana/AsistenteCalendarioN8N',
    story: [
      bi(
        'Un entorno completo que se levanta con un comando: WhatsApp entra por Evolution API, n8n orquesta, Postgres persiste y Redis mantiene el ritmo. Un agente de IA lee el mensaje y crea el evento.',
        'A complete environment that comes up with one command: WhatsApp arrives through Evolution API, n8n orchestrates, Postgres persists and Redis keeps the pace. An AI agent reads the message and creates the event.',
      ),
      bi(
        'Lo interesante fue el pegamento entre servicios. Es el proyecto con el que empecé a tomarme la infraestructura en serio.',
        'The interesting part was the glue between services. It is the project that got me taking infrastructure seriously.',
      ),
    ],
    features: [
      bi('WhatsApp como interfaz: texto y notas de voz.', 'WhatsApp as the interface: text and voice notes.'),
      bi('Transcribe el audio y entiende la intención con un agente de IA.', 'Transcribes the audio and reads intent with an AI agent.'),
      bi('Crea, mueve y consulta eventos en Google Calendar.', 'Creates, moves and looks up events in Google Calendar.'),
      bi('Memoria de conversación en PostgreSQL: recuerda el hilo.', 'Conversation memory in PostgreSQL: it remembers the thread.'),
      bi('Todo en Docker Compose, con Redis para las colas de n8n.', 'All in Docker Compose, with Redis for the n8n queues.'),
      bi('Webhooks expuestos con ngrok para probarlo en local.', 'Webhooks exposed through ngrok to test it locally.'),
    ],
    hue: 'red',
  },
  {
    id: 'phone-remote',
    num: '04',
    title: 'Phone Remote',
    line: bi(
      'El teléfono como mando de una página web: se escanea un QR y el giroscopio maneja la pantalla grande.',
      'The phone as a controller for a web page: scan a QR and the gyroscope drives the big screen.',
    ),
    stack: ['TypeScript', 'WebRTC', 'PeerJS', 'DeviceOrientation', 'Vite', 'Express'],
    year: '2026',
    role: bi('Protocolo, calibración y demo', 'Protocol, calibration and demo'),
    repo: 'https://github.com/cesaromana/phone-remote',
    story: [
      bi(
        'Es la pieza que mueve el mando de esta misma página, sacada aparte para que sirva en cualquier sitio. No hay aplicación que instalar: el mando es otra página web, y después del saludo los datos van directo de un aparato al otro.',
        'It is the piece driving the controller on this very page, pulled out so it works anywhere. There is nothing to install: the controller is another web page, and after the handshake the data goes straight from one device to the other.',
      ),
      bi(
        'Lo difícil no fue conectar, fue que se sintiera bien: encontrar el centro sin hacer esperar y que la cruceta no tiemble con cada lectura del sensor.',
        'The hard part was not connecting, it was making it feel right: finding the centre without a wait, and keeping the crosshair from shaking with every sensor reading.',
      ),
    ],
    features: [
      bi('Enlace por QR y WebRTC: la señalización sólo los presenta.', 'QR pairing over WebRTC: signalling only introduces them.'),
      bi('Calibración que mide el temblor de la mano en vez de contar segundos.', 'Calibration that measures hand shake instead of counting seconds.'),
      bi('Puntero suavizado a cadencia de pantalla, no a la del sensor.', 'Pointer smoothed at screen rate, not at sensor rate.'),
      bi('Botones A y B con vibración confirmada desde la pantalla.', 'A and B buttons, with the haptic confirmed by the screen.'),
      bi('Arrastre en fracciones: el mismo gesto recorre lo mismo en cualquier teléfono.', 'Drag in fractions: the same gesture travels the same on any phone.'),
      bi('Servidor propio con señalización y TLS local, porque sin HTTPS no hay giroscopio.', 'Own server with signalling and local TLS, because without HTTPS there is no gyroscope.'),
    ],
    hue: 'blue',
  },
];
