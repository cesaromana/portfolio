import { S } from '../i18n/strings';
import type { Bi } from '../i18n/lang-context';
import { FruitGame } from './fruit';
import type { Game, GameId } from './game';
import { MazeGame } from './maze';
import { RoadGame } from './road';
import { TargetGame } from './target';

export type Entry = {
  id: GameId;
  mark: string;
  title: Bi;
  how: Bi;
  /** Cómo se juega en teléfono, cuando hay giroscopio. */
  tiltHow: Bi;
  make: () => Game;
};

export const catalog: Entry[] = [
  { id: 'fruit', mark: 'A', title: S.arcade.fruit, how: S.arcade.fruitHow, tiltHow: S.arcade.fruitTilt, make: () => new FruitGame() },
  { id: 'road', mark: 'B', title: S.arcade.road, how: S.arcade.roadHow, tiltHow: S.arcade.roadTilt, make: () => new RoadGame() },
  { id: 'maze', mark: 'C', title: S.arcade.maze, how: S.arcade.mazeHow, tiltHow: S.arcade.mazeTilt, make: () => new MazeGame() },
  { id: 'target', mark: 'D', title: S.arcade.target, how: S.arcade.targetHow, tiltHow: S.arcade.targetTilt, make: () => new TargetGame() },
];

export function entryOf(id: GameId) {
  return catalog.find((e) => e.id === id) ?? catalog[0];
}
