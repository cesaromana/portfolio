import { bi, type Bi } from '../i18n/lang-context';

export type Job = {
  company: string;
  /** 'study' pinta la entrada como formación, no como empleo. */
  kind?: 'work' | 'study';
  role: Bi;
  period: Bi;
  where: Bi;
  summary: Bi;
  stack: string[];
};

export const jobs: Job[] = [
  {
    company: 'Baleares Group',
    role: bi('Desarrollador full stack', 'Full stack developer'),
    period: bi('02/2026 → hoy', '02/2026 → now'),
    where: bi('Valencia, Venezuela', 'Valencia, Venezuela'),
    summary: bi(
      'Producto web y backend para las marcas del grupo: servicios internos, APIs y sitios públicos. Del diseño del endpoint al deploy.',
      'Web product and backend for the group brands: internal services, APIs and public sites. From endpoint design to deploy.',
    ),
    stack: ['JAD', 'TypeScript', 'React', 'Node', 'PostgreSQL', 'Docker'],
  },
  {
    company: 'Netcom Plus',
    role: bi('Desarrollador de software', 'Software developer'),
    period: bi('12/2024 → 02/2026', '12/2024 → 02/2026'),
    where: bi('Valencia, Venezuela', 'Valencia, Venezuela'),
    summary: bi(
      'Desarrollo sobre Odoo y servicios a medida: módulos, migraciones de datos, automatizaciones y mantenimiento de sistemas en producción.',
      'Odoo development and custom services: modules, data migrations, automations and maintenance of systems in production.',
    ),
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
    stack: ['Unity', 'C#', 'ML-Agents', 'Python'],
  },
];
