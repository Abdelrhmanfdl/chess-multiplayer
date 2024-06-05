import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { OnlineGameService } from 'src/app/online-game.service';
import { JoinOnlineGameEvent } from 'src/types/JoinOnlineGameEvent';
import { OnlineGameState } from 'src/types/OnlineGameState';

@Component({
  selector: 'app-online-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(private onlineGameService: OnlineGameService) {}
  @Output() joinedGame = new EventEmitter<JoinOnlineGameEvent>();

  createGame() {
    this.onlineGameService
      .createGame()
      .then((gameId) => Promise.all([this.observeGame(gameId), gameId]))
      .then(([gameObservable, gameId]) => {
        this.joinedGame.emit({ gameObservable, isCreator: true, gameId });
      });
  }

  joinGame(gameId: string) {
    const gameObservable = this.observeGame(gameId);
    this.joinedGame.emit({ gameObservable, isCreator: false, gameId });
  }

  private observeGame(gameId): Observable<OnlineGameState> {
    return this.onlineGameService.joinGame(gameId);
  }
}
