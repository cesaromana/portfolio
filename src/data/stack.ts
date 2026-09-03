import { bi, type Bi } from '../i18n/lang-context';

// Íconos de skillicons.dev, los mismos del perfil de GitHub.
export type Group = 'lang' | 'frame' | 'data' | 'tool';

export type Tool = { id: string; name: string; group: Group; size: number; text?: boolean; icon?: string };

export const groupNames: Record<Group, Bi> = {
  lang: bi('Lenguajes', 'Languages'),
  frame: bi('Frameworks y entornos', 'Frameworks & runtimes'),
  data: bi('Datos', 'Data'),
  tool: bi('Herramientas e infraestructura', 'Tools & infrastructure'),
};

const ODOO_ICON = 'https://api.iconify.design/selfhst/odoo.svg';

export const tools: Tool[] = [
  { id: 'ts', name: 'TypeScript', group: 'lang', size: 119 },
  { id: 'go', name: 'Go', group: 'lang', size: 109 },
  { id: 'python', name: 'Python', group: 'lang', size: 104 },
  { id: 'java', name: 'Java', group: 'lang', size: 98 },
  { id: 'cs', name: 'C#', group: 'lang', size: 93 },
  { id: 'js', name: 'JavaScript', group: 'lang', size: 98 },
  { id: 'bash', name: 'Bash', group: 'lang', size: 78 },

  { id: 'react', name: 'React', group: 'frame', size: 114 },
  { id: 'nodejs', name: 'Node.js', group: 'frame', size: 109 },
  { id: 'nextjs', name: 'Next.js', group: 'frame', size: 96 },
  { id: 'dotnet', name: '.NET', group: 'frame', size: 91 },
  { id: 'unity', name: 'Unity', group: 'frame', size: 101 },
  { id: 'odoo', name: 'Odoo', group: 'frame', size: 96, icon: ODOO_ICON },

  { id: 'sql', name: 'SQL', group: 'data', size: 96, text: true },
  { id: 'postgres', name: 'PostgreSQL', group: 'data', size: 106 },
  { id: 'mysql', name: 'MySQL', group: 'data', size: 100 },
  { id: 'redis', name: 'Redis', group: 'data', size: 88 },
  { id: 'dragonfly', name: 'Dragonfly', group: 'data', size: 92, text: true },

  { id: 'docker', name: 'Docker', group: 'tool', size: 101 },
  { id: 'gcp', name: 'Google Cloud', group: 'tool', size: 96 },
  { id: 'linux', name: 'Linux', group: 'tool', size: 88 },
  { id: 'git', name: 'Git', group: 'tool', size: 83 },
  { id: 'github', name: 'GitHub', group: 'tool', size: 83 },
  { id: 'postman', name: 'Postman', group: 'tool', size: 78 },
  { id: 'vscode', name: 'VS Code', group: 'tool', size: 78 },
];

export function iconUrl(tool: Tool) {
  return tool.icon ?? `https://skillicons.dev/icons?i=${tool.id}`;
}

export function byGroup(group: Group) {
  return tools.filter((tool) => tool.group === group);
}
