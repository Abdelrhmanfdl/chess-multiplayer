import { Observable } from 'rxjs';
import { GameState } from './GameState';

export type JoinOnlineGameEvent = {
  gameObservable: Observable<GameState>;
  gameId: string;
  isCreator: boolean;
};
