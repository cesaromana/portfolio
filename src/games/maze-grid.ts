export type Cell = { n: boolean; e: boolean; s: boolean; w: boolean };

/** Laberinto perfecto por recorrido en profundidad: siempre hay un camino. */
export function carve(cols: number, rows: number): Cell[] {
  const cells: Cell[] = Array.from({ length: cols * rows }, () => ({ n: true, e: true, s: true, w: true }));
  const seen = new Set<number>([0]);
  const stack = [0];

  while (stack.length > 0) {
    const at = stack[stack.length - 1];
    const next = neighbors(at, cols, rows).filter((n) => !seen.has(n.index));
    if (next.length === 0) {
      stack.pop();
      continue;
    }
    const pick = next[Math.floor(Math.random() * next.length)];
    open(cells[at], pick.dir);
    open(cells[pick.index], opposite(pick.dir));
    seen.add(pick.index);
    stack.push(pick.index);
  }
  return cells;
}

type Dir = 'n' | 'e' | 's' | 'w';

function neighbors(index: number, cols: number, rows: number) {
  const col = index % cols;
  const row = Math.floor(index / cols);
  const out: { index: number; dir: Dir }[] = [];
  if (row > 0) out.push({ index: index - cols, dir: 'n' });
  if (col < cols - 1) out.push({ index: index + 1, dir: 'e' });
  if (row < rows - 1) out.push({ index: index + cols, dir: 's' });
  if (col > 0) out.push({ index: index - 1, dir: 'w' });
  return out;
}

function open(cell: Cell, dir: Dir) {
  cell[dir] = false;
}

function opposite(dir: Dir): Dir {
  if (dir === 'n') return 's';
  if (dir === 's') return 'n';
  if (dir === 'e') return 'w';
  return 'e';
}
