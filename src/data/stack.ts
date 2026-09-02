import { bi, type Bi } from '../i18n/lang-context';

// Íconos de skillicons.dev, los mismos del perfil de GitHub.
export type Tool = { id: string; name: string; group: Bi; size: number; text?: boolean };

const LANG = bi('Lenguaje', 'Language');
const FRAME = bi('Framework', 'Framework');
const TOOL = bi('Herramienta', 'Tool');

export const tools: Tool[] = [
  { id: 'ts', name: 'TypeScript', group: LANG, size: 119 },
  { id: 'go', name: 'Go', group: LANG, size: 109 },
  { id: 'python', name: 'Python', group: LANG, size: 104 },
  { id: 'java', name: 'Java', group: LANG, size: 98 },
  { id: 'sql', name: 'SQL', group: LANG, size: 96, text: true },
  { id: 'cs', name: 'C#', group: LANG, size: 93 },
  { id: 'js', name: 'JavaScript', group: LANG, size: 98 },
  { id: 'bash', name: 'Bash', group: LANG, size: 78 },
  { id: 'react', name: 'React', group: FRAME, size: 114 },
  { id: 'nodejs', name: 'Node.js', group: FRAME, size: 109 },
  { id: 'dotnet', name: '.NET', group: FRAME, size: 91 },
  { id: 'unity', name: 'Unity', group: FRAME, size: 101 },
  { id: 'postgres', name: 'PostgreSQL', group: TOOL, size: 106 },
  { id: 'docker', name: 'Docker', group: TOOL, size: 101 },
  { id: 'gcp', name: 'Google Cloud', group: TOOL, size: 96 },
  { id: 'git', name: 'Git', group: TOOL, size: 83 },
  { id: 'linux', name: 'Linux', group: TOOL, size: 88 },
  { id: 'postman', name: 'Postman', group: TOOL, size: 78 },
  { id: 'vscode', name: 'VS Code', group: TOOL, size: 78 },
  { id: 'github', name: 'GitHub', group: TOOL, size: 83 },
];

export const ODOO_ICON = 'https://api.iconify.design/selfhst/odoo.svg';

export function iconUrl(id: string) {
  return `https://skillicons.dev/icons?i=${id}`;
}
