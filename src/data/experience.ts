import { bi, type Bi } from '../i18n/lang-context';

export type Job = {
  company: string;
  /** 'study' pinta la entrada como formación, no como empleo. */
  kind?: 'work' | 'study';
  role: Bi;
  period: Bi;
  where: Bi;
  summary: Bi;
  /** Lo que se abre al desplegar la entrada. */
  details: Bi[];
  stack: string[];
};

export const jobs: Job[] = [
  {
    company: 'Baleares Group',
    role: bi('Desarrollador full stack', 'Full stack developer'),
    period: bi('02/2026 → hoy', '02/2026 → now'),
    where: bi('Valencia, Venezuela', 'Valencia, Venezuela'),
    summary: bi(
      'Producto web y backend para las marcas del grupo, con la infraestructura en la nube.',
      'Web product and backend for the group brands, with the infrastructure in the cloud.',
    ),
    details: [
      bi(
        'Aplicaciones a medida para distintas empresas del grupo: del diseño del endpoint al despliegue.',
        'Custom applications for the different companies in the group: from endpoint design to deploy.',
      ),
      bi(
        'Sistema administrativo para Santillana Argentina.',
        'Administrative system for Santillana Argentina.',
      ),
      bi(
        'Sistemas de delivery, entre ellos La Caja Gourmet.',
        'Delivery systems, among them La Caja Gourmet.',
      ),
      bi(
        'Trabajo sobre infraestructura en la nube: entornos, despliegues y puesta en producción.',
        'Cloud infrastructure work: environments, deploys and shipping to production.',
      ),
      bi(
        'Evolución y ajustes de sistemas que ya estaban en marcha.',
        'Evolving and adjusting systems already running.',
      ),
    ],
    stack: ['JAD', 'TypeScript', 'React', 'Node', 'PostgreSQL', 'Docker'],
  },
  {
    company: 'Netcom Plus',
    role: bi('Desarrollador de software', 'Software developer'),
    period: bi('12/2024 → 02/2026', '12/2024 → 02/2026'),
    where: bi('Valencia, Venezuela', 'Valencia, Venezuela'),
    summary: bi(
      'Desarrollo sobre Odoo y servicios a medida: módulos, migraciones y sistemas en producción.',
      'Odoo development and custom services: modules, migrations and systems in production.',
    ),
    details: [
      bi(
        'Creación de distintos módulos a medida en Odoo.',
        'Built several custom modules in Odoo.',
      ),
      bi(
        'Módulo de suscripciones: procesos del negocio, optimizaciones y su conexión con el controlador de red.',
        'Subscriptions module: business processes, optimizations and its link to the network controller.',
      ),
      bi(
        'Mantenimiento y desarrollo del controlador de red.',
        'Maintenance and development of the network controller.',
      ),
      bi(
        'Implementación de una API de mensajería hecha en Go, para administrar el envío de mensajes.',
        'Implemented a messaging API written in Go to manage message delivery.',
      ),
      bi('Desarrollo de una aplicación de mensajería.', 'Built a messaging application.'),
      bi('Migraciones de datos entre versiones y entre sistemas.', 'Data migrations between versions and between systems.'),
    ],
    stack: ['Odoo', 'Python', 'Go', 'PostgreSQL', 'Docker', 'Linux'],
  },
  {
    company: 'Universidad José Antonio Páez',
    kind: 'study',
    role: bi('Ingeniería en Computación', 'Computer Engineering'),
    period: bi('11/2019 → 04/2024', '11/2019 → 04/2024'),
    where: bi('Valencia, Venezuela', 'Valencia, Venezuela'),
    summary: bi(
      'Tesis: agente inteligente basado en aprendizaje automático para la locomoción adaptativa en entornos 3D simulados en Unity.',
      'Thesis: a machine-learning agent for adaptive locomotion in simulated 3D environments built in Unity.',
    ),
    details: [
      bi(
        'El agente aprende a caminar por sí mismo en entornos que cambian, sin animaciones preparadas.',
        'The agent learns to walk on its own across changing terrain, with no canned animations.',
      ),
      bi(
        'Entrenamiento por refuerzo con ML-Agents sobre escenarios construidos en Unity.',
        'Reinforcement training with ML-Agents over scenarios built in Unity.',
      ),
    ],
    stack: ['Unity', 'C#', 'ML-Agents', 'Python'],
  },
];
