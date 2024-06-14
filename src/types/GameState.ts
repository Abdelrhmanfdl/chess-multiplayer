import { Player } from 'src/enums/Player';

export type GameState = {
  fen?: string;
  ready?: boolean;
  checkmate?: boolean;
  turn?: Player;
};
