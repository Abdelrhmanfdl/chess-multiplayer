import { Component } from '@angular/core';
import { OnlineGameState } from 'src/types/OnlineGameState';
import { OnlineGameService } from '../online-game.service';
import { JoinOnlineGameEvent } from 'src/types/JoinOnlineGameEvent';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css'],
})
export class OnlineComponent {
  gameId: string | null = null;
  isCreator: boolean = false;
  gameObservable: Observable<OnlineGameState> | null = null;

  constructor(private onlineGameService: OnlineGameService) {}

  joinedGame({ gameObservable, isCreator, gameId }: JoinOnlineGameEvent) {
    console.log('joinedEvent', isCreator, gameId);
    this.gameId = gameId;
    this.gameObservable = gameObservable;
    this.isCreator = isCreator;
    if (!isCreator) this.ready = true;
  }

  leave() {
    this.ready = false;
    this.gameId = null;
    this.gameObservable = null;
    // TODO: if creator destroy the game in db
  }

  get isGameInitiated(): boolean {
    return this.gameId !== null;
  }

  set ready(isReady: boolean) {
    this.onlineGameService.updateGame(this.gameId, { ready: isReady });
  }
}
