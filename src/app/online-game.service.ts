import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { OnlineGameState } from 'src/types/OnlineGameState';

@Injectable({
  providedIn: 'root',
})
export class OnlineGameService {
  constructor(private db: AngularFireDatabase) {}

  async createGame(): Promise<string> {
    const gameId = this.db.createPushId();
    const newGame: OnlineGameState = {
      fen: null,
      checkmate: false,
      ready: false,
    };
    this.db.object(`game/${gameId}`).set(newGame);
    return gameId;
  }

  joinGame(gameId: string): Observable<OnlineGameState> {
    // TODO: assert not ready
    return this.db.object(`game/${gameId}`).valueChanges();
  }

  updateGame(gameId: string, newState: OnlineGameState): Promise<void> {
    return this.db
      .object(`game/${gameId}`)
      .update(newState)
      .then(() => {
        console.log(`game/${gameId}`, 'updated game with state', newState);
      })
      .catch((e) => {
        console.log('Can not update game: ', e.message);
      });
  }
}
