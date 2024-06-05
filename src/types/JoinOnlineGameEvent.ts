import { Observable } from 'rxjs';
import { OnlineGameState } from './OnlineGameState';

export type JoinOnlineGameEvent = {
  gameObservable: Observable<OnlineGameState>;
  gameId: string;
  isCreator: boolean;
};
