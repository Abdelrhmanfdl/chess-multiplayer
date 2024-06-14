import { Component } from '@angular/core';
import { GameState } from 'src/types/GameState';
import { OnlineGameService } from '../online-game.service';
import { JoinOnlineGameEvent } from 'src/types/JoinOnlineGameEvent';
import { Observable } from 'rxjs';
import { Player } from 'src/enums/Player';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css'],
})
export class OnlineComponent {
  gameId: string | null = null;
  isCreator: boolean = false;
  gameObservable: Observable<GameState> | null = null;

  constructor(private onlineGameService: OnlineGameService) {}

  joinedGame({ gameObservable, isCreator, gameId }: JoinOnlineGameEvent) {
    this.gameId = gameId;
    this.gameObservable = gameObservable;
    this.isCreator = isCreator;
    if (!isCreator) this.ready = true;
  }

  leave() {
    this.onlineGameService.removeGame(this.gameId);
    this.gameId = null;
    this.gameObservable = null;
  }

  get isGameInitiated(): boolean {
    return this.gameId !== null;
  }

  set ready(isReady: boolean) {
    this.onlineGameService.updateGame(this.gameId, {
      ready: isReady,
      turn: Player.WHITE,
      checkmate: false,
    });
  }
}
