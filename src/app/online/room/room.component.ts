import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Player } from 'src/enums/Player';
import { OnlineGameState } from 'src/types/OnlineGameState';

@Component({
  selector: 'app-online-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent {
  @Input() gameId: string | null = null;
  @Input() isCreator: boolean = false;
  _gameObservable: Observable<OnlineGameState> | null = null;
  gameState: OnlineGameState = {};
  gameSubscription: Subscription = null;
  @Output() leaveRoom = new EventEmitter<void>();

  @Input() set gameObservable(newGameObservable) {
    if (newGameObservable === this._gameObservable) return;

    this._gameObservable = newGameObservable;
    if (this.gameSubscription) this.gameSubscription.unsubscribe();

    this.gameSubscription = this._gameObservable.subscribe(
      (gameStateUpdate: OnlineGameState) => {
        console.log(
          `gameId ${this.gameId} | isCreator ${this.isCreator} | 'new data: `,
          gameStateUpdate
        );
        this.processGameEvent(gameStateUpdate);
      }
    );
  }

  private processGameEvent({ fen, ready, checkmate }: OnlineGameState) {
    if (this.gameState?.fen !== fen) this.handleFenUpdate(fen);
    if (this.gameState?.ready !== ready) this.handleReadinessUpdate(ready);
    if (this.gameState?.checkmate !== checkmate)
      this.handleCheckmateUpdate(checkmate);
  }

  private handleFenUpdate(fenUpdate: string) {
    this.gameState.fen = fenUpdate;
    //TODO: message to board with new fen
  }

  private handleReadinessUpdate(readyUpdate: boolean) {
    this.gameState.ready = readyUpdate;
    //TODO: update UI, either show menu or chess board
  }

  private handleCheckmateUpdate(checkmateUpdate: boolean) {
    this.gameState.checkmate = checkmateUpdate;
    //TODO: show message
  }

  get isGameReady(): boolean {
    return this.gameState.ready;
  }

  get isCheckmate(): boolean {
    return this.gameState?.checkmate;
  }

  handleLeave() {
    this.leaveRoom.emit();
  }
}
