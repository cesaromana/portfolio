import { bi } from '../i18n/lang-context';

export const profile = {
  name: ['César', 'Omaña'],
  handle: 'cesaromana',
  city: bi('Valencia, Venezuela', 'Valencia, Venezuela'),
  birthplace: bi('Mérida, Venezuela', 'Mérida, Venezuela'),
  born: '2002-09-30',
  links: {
    github: 'https://github.com/cesaromana',
    linkedin: 'https://www.linkedin.com/in/cesar-oma%C3%B1a/',
    instagram: 'https://instagram.com/noescsar',
  },
  cat: 'Brando',
  email: 'cesarluis30902@gmail.com',
  // Venezuela: el 0 inicial se sustituye por el prefijo +58.
  phone: { dial: '+584145970668', pretty: '+58 414 597 0668' },
};

// Lo que dice el globo del hero. Primera persona, sin poses.
export const heroBalloon = [
  bi(
    'Ingeniero en computación. Nací en Mérida el 30 de septiembre de 2002 y vivo en Valencia.',
    'Computer engineer. Born in Mérida on September 30, 2002, living in Valencia.',
  ),
  bi(
    'Me especializo en backend, pero trabajo la aplicación completa: la API, la base de datos y la pantalla que la usa.',
    'I specialize in backend, but I work the whole application: the API, the database and the screen that uses it.',
  ),
  bi(
    'Cuando no estoy en eso, ando en algún proyecto propio para seguir afilando lo que sé.',
    'When I am not doing that, I am on some project of my own, sharpening what I know.',
  ),
];

// Presentación larga, para la doble página.
export const aboutText = [
  bi(
    'Estudié Ingeniería en Computación en la Universidad José Antonio Páez y me gradué en 2024. Desde entonces trabajo como desarrollador full stack, con el backend como zona cómoda: diseñar servicios, cuidar los datos y dejar todo listo para que el deploy no sea un evento.',
    'I studied Computer Engineering at Universidad José Antonio Páez and graduated in 2024. Since then I have worked as a full stack developer, with backend as my comfort zone: designing services, taking care of the data and leaving everything ready so a deploy is not an event.',
  ),
  bi(
    'Ahora mismo estoy metido en infraestructura y arquitectura de sistemas, y en aprender Go y TypeScript a fondo. Siempre tengo un proyecto propio abierto para probar lo que voy aprendiendo: los juegos de esta página son uno de ellos.',
    'Right now I am deep into infrastructure and systems architecture, and into learning Go and TypeScript properly. I always keep a project of my own open to try what I am learning: the games on this page are one of them.',
  ),
];

export function ageFrom(born: string, today = new Date()) {
  const b = new Date(born);
  let age = today.getFullYear() - b.getFullYear();
  const hadBirthday = today.getMonth() > b.getMonth() || (today.getMonth() === b.getMonth() && today.getDate() >= b.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}
