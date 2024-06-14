import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, firstValueFrom, of, switchMap } from 'rxjs';
import { JoinError } from 'src/enums/JoinError';
import { GameState } from 'src/types/GameState';

@Injectable({
  providedIn: 'root',
})
export class OnlineGameService {
  constructor(private db: AngularFireDatabase) {}

  async createGame(): Promise<string> {
    const gameId = this.db.createPushId();
    const newGame: GameState = {
      fen: null,
      checkmate: false,
      ready: false,
    };
    return this.db
      .object(`game/${gameId}`)
      .set(newGame)
      .then(() => gameId);
  }

  async joinGame(gameId: string): Promise<Observable<GameState>> {
    const result = await firstValueFrom(
      this.db.object<GameState>(`game/${gameId}`).valueChanges()
    );

    if (!result) {
      const err = new Error('game does not exist');
      err.cause = { type: JoinError.NOT_EXIST };
      throw err;
    }

    if (result.ready) {
      const err = new Error('game is full');
      err.cause = { type: JoinError.FULL };
      throw err;
    }

    return this.db.object(`game/${gameId}`).valueChanges();
  }

  updateGame(gameId: string, newState: GameState): Promise<void> {
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

  removeGame(gameId: string): Promise<void> {
    return this.db
      .object(`game/${gameId}`)
      .remove()
      .then(() => {
        console.log(`game/${gameId}`, 'removed');
      })
      .catch((e) => {
        console.log('Can not remove game: ', e.message);
      });
  }
}
