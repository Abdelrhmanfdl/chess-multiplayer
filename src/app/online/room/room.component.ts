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
import { OnlineGameService } from 'src/app/online-game.service';
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
  _gameSubscription: Subscription = null;
  _isReady: boolean = false;
  @Output() leaveRoom = new EventEmitter<void>();

  @Input() set gameObservable(newGameObservable) {
    if (newGameObservable === this._gameObservable) return;

    this._gameObservable = newGameObservable;
    if (this._gameSubscription) this._gameSubscription.unsubscribe();

    this._gameSubscription = this._gameObservable.subscribe(
      (gameStateUpdate: OnlineGameState) =>
        this.processGameEvent(gameStateUpdate)
    );
  }

  constructor(
    private gameService: GameService,
    private onlineGameService: OnlineGameService
  ) {}

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
          let move = event.data.move;
          this.gameService.processMove({
            fen: move.fen,
            checkmate: move.checkmate,
          });
          this.onlineGameService.updateGame(
            this.gameId,
            this.gameService.gameState
          );
          break;
      }
    });
  }

  private processGameEvent({ fen, ready, checkmate }: OnlineGameState) {
    if (
      this.gameService.gameState.fen !== fen ||
      this.gameService.gameState.checkmate !== checkmate
    )
      this.handleFenUpdate({ fen, checkmate });
    if (this._isReady !== ready) this.handleReadinessUpdate({ ready });
  }

  private handleFenUpdate({
    fen,
    checkmate,
  }: {
    fen: string;
    checkmate: boolean;
  }) {
    this.gameService.processMove({ fen, checkmate });
  }

  private handleReadinessUpdate({ ready }: { ready: boolean }) {
    this._isReady = ready;
  }

  get playerType(): Player {
    return this.isCreator ? Player.WHITE : Player.BLACK;
  }

  get isGameReady(): boolean {
    return this._isReady;
  }

  get isCheckmate(): boolean {
    return this.gameService.gameState.checkmate;
  }

  handleLeave() {
    this.leaveRoom.emit();
  }

  handleReset() {
    this.gameService.reset();
    this.onlineGameService.updateGame(this.gameId, {
      fen: null,
      checkmate: false,
      turn: Player.WHITE,
    });
  }
}
