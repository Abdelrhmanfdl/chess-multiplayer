import { Player } from 'src/enums/Player';

export type OnlineGameState = {
  fen?: string;
  ready?: boolean;
  checkmate?: boolean;
  turn?: Player;
};
