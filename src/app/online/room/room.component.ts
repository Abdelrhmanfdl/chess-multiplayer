import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { GameEvent } from 'src/enums/GameEvent';
import { Player } from 'src/enums/Player';
import { OnlineGameState } from 'src/types/OnlineGameState';

@Component({
  selector: 'app-online-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements AfterViewInit {
  @ViewChild('board') boardView: ElementRef<HTMLIFrameElement> | undefined;
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

  constructor(private gameService: GameService) {}

  ngAfterViewInit(): void {
    console.warn(this.boardView);
    this.gameService.boards = [
      {
        iframe: this.boardView,
        playerType: this.playerType,
      },
    ];

    this.gameService.setupBoards();

    window.addEventListener('message', (event) => {
      if (event.origin !== window.origin) return;
      switch (event.data.messageType) {
        case GameEvent.MOVE:
          this.gameService.processMove(event.data.move);
          break;
      }
    });
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

  get playerType(): Player {
    return this.isCreator ? Player.WHITE : Player.BLACK;
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
