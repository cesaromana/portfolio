import { bi, type Bi } from '../i18n/lang-context';

// Películas: se intenta leer el RSS de Letterboxd vía /api/letterboxd.
// Si no hay usuario configurado (LETTERBOXD_USER), se usa esta lista.
export type Film = { title: string; year?: string; rating?: number; poster?: string; url?: string };

export const filmsFallback: Film[] = [
  { title: 'Spider-Man: Into the Spider-Verse', year: '2018', rating: 5 },
  { title: 'Scott Pilgrim vs. the World', year: '2010', rating: 5 },
  { title: 'Haikyu!! The Dumpster Battle', year: '2024', rating: 4.5 },
  { title: 'Sonic the Hedgehog 2', year: '2022', rating: 4 },
  { title: 'Jujutsu Kaisen 0', year: '2021', rating: 4.5 },
];

/**
 * Música. `id` es el identificador de Spotify para el reproductor incrustado;
 * sin él, la pista abre la búsqueda en Spotify (los IDs se pegan a mano porque
 * la API de búsqueda exige credenciales).
 */
export type Track = { kind: 'track' | 'artist'; id?: string; title: string; artist: string };

export const tracks: Track[] = [
  { kind: 'track', id: '44fsHeGMWo6WgucLYeyONa', title: 'MORFEO', artist: 'WOS' },
  { kind: 'track', id: '7iG17BHNVVEUr5gIiJX2xX', title: 'Te Veo', artist: 'Lasso' },
  { kind: 'track', id: '0LRgY9XAxrghqLDAaJ3o1v', title: 'Buenos Tiempos', artist: 'Dillom' },
  { kind: 'track', id: '1Fcp74jdEpOohdgPCCGI8f', title: 'Halfway There', artist: 'Big Time Rush' },
  { kind: 'track', id: '5N3hjp1WNayUPZrA8kJmJP', title: 'Please Please Please', artist: 'Sabrina Carpenter' },
  { kind: 'track', id: '02sy7FAs8dkDNYsHp4Ul3f', title: 'Soda Pop', artist: 'Saja Boys' },
];

/**
 * Portadas de AniList (CDN público, sin API key). `local` gana cuando existe:
 * ahí van las portadas de un tomo concreto, que ninguna API pública sirve.
 */
export type Cover = { title: string; since: string; cover: string; local?: string; tilt: number; note?: Bi };

const ANI = 'https://s4.anilist.co/file/anilistcdn/media';

export const mangas: Cover[] = [
  {
    title: 'Katekyo Hitman Reborn!',
    since: '2004',
    cover: `${ANI}/manga/cover/large/bx30047-Gr8KL98hzzYT.jpg`,
    local: '/covers/reborn-33.png',
    tilt: -3,
  },
  { title: 'Black Clover', since: '2015', cover: `${ANI}/manga/cover/large/bx86123-Ill8uBdtvWrR.png`, tilt: 2 },
  { title: 'Blue Lock', since: '2018', cover: `${ANI}/manga/cover/large/bx106130-yPNeuSu75ey1.jpg`, tilt: -1 },
  { title: 'Kaguya-sama: Love is War', since: '2015', cover: `${ANI}/manga/cover/large/bx86635-EdaLQmsn86Fy.png`, tilt: 1.5 },
  { title: 'Bleach', since: '2001', cover: `${ANI}/manga/cover/large/bx30012-1epmVfTSv2rr.png`, tilt: -2 },
  { title: 'Dr. Stone', since: '2017', cover: `${ANI}/manga/cover/medium/b98416-L44f4idEGMAX.jpg`, tilt: 2.5 },
];

export const animes: Cover[] = [
  {
    title: 'Jujutsu Kaisen',
    since: '2020',
    cover: `${ANI}/anime/cover/large/bx113415-LHBAeoZDIsnF.jpg`,
    tilt: -1.5,
    note: bi('Shibuya. Nada más que decir.', 'Shibuya. Nothing more to say.'),
  },
  {
    title: 'Naruto Shippuden',
    since: '2007',
    cover: `${ANI}/anime/cover/large/bx1735-kGfVm0YqCPcu.png`,
    tilt: 2.5,
    note: bi('Creció conmigo, capítulo a capítulo.', 'It grew up with me, episode by episode.'),
  },
  {
    title: 'Haikyu!!',
    since: '2014',
    cover: `${ANI}/anime/cover/large/bx20464-ooZUyBe4ptp9.png`,
    tilt: 2,
    note: bi('Karasuno hasta el final.', 'Karasuno till the end.'),
  },
  {
    title: 'Gintama',
    since: '2006',
    cover: `${ANI}/anime/cover/large/bx918-iOaeBVUn4uK7.jpg`,
    tilt: -2,
    note: bi('Te hace reír y al capítulo siguiente te parte.', 'It makes you laugh, then breaks you the next episode.'),
  },
  {
    title: 'Mob Psycho 100',
    since: '2016',
    cover: `${ANI}/anime/cover/large/bx21507-6YUSbh2m0N1p.jpg`,
    tilt: -1,
    note: bi('La mejor animación que he visto.', 'The best animation I have ever seen.'),
  },
  {
    title: 'Wotakoi',
    since: '2018',
    cover: `${ANI}/anime/cover/large/nx99578-oO5KChtfhzln.png`,
    tilt: 1,
    note: bi('Amor de oficina para gente que juega.', 'Office romance for people who game.'),
  },
];

// Series sin portada: tipográficas.
export const series: { title: string; years: string; note: Bi }[] = [
  { title: 'How I Met Your Mother', years: '2005 → 2014', note: bi('Legen… espera… dario.', 'Legen… wait for it… dary.') },
  { title: 'Brooklyn Nine-Nine', years: '2013 → 2021', note: bi('Nine-Nine.', 'Nine-Nine.') },
  { title: "It's Always Sunny in Philadelphia", years: '2005 → hoy', note: bi('Nadie tiene razón nunca.', 'Nobody is ever right.') },
  { title: 'Modern Family', years: '2009 → 2020', note: bi('La que siempre se puede volver a poner.', 'The one you can always put back on.') },
  { title: 'The Flash', years: '2014 → 2023', note: bi('Solo hasta la cuarta: de ahí en adelante se pone malísima.', 'Only up to season four; after that it falls apart.') },
  { title: 'Scott Pilgrim Takes Off', years: '2023', note: bi('La película, en anime, otra vez.', 'The film, as anime, again.') },
];

// Sonic: port open source (MIT) del fan game Open Sonic, alojado aquí mismo.
export const sonicUrl = '/sonic/sonic.html';
