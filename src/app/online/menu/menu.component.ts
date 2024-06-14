import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { OnlineGameService } from 'src/app/online-game.service';
import { JoinError } from 'src/enums/JoinError';
import { JoinOnlineGameEvent } from 'src/types/JoinOnlineGameEvent';
import { GameState } from 'src/types/GameState';

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
    this.observeGame(gameId)
      .then((gameObservable: Observable<GameState>) => {
        this.joinedGame.emit({ gameObservable, isCreator: false, gameId });
      })
      .catch((err) => {
        if (err.cause.type == JoinError.NOT_EXIST)
          alert('Game does not exist, you can create one');
        else if (err.cause.type == JoinError.FULL)
          alert('Game is already full');
      });
  }

  private async observeGame(gameId): Promise<Observable<GameState>> {
    return this.onlineGameService.joinGame(gameId);
  }
}
