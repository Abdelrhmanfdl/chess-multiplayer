import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OnlineGameService } from 'src/app/online-game.service';
import { GameService } from 'src/app/services/game.service';
import { GameEvent } from 'src/enums/GameEvent';
import { Player } from 'src/enums/Player';
import { GameState } from 'src/types/GameState';

@Component({
  selector: 'app-online-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements AfterViewInit, OnDestroy {
  @ViewChild('board') boardView: ElementRef<HTMLIFrameElement> | undefined;
  @Input() gameId: string | null = null;
  @Input() isCreator: boolean = false;
  _gameObservable: Observable<GameState> | null = null;
  _gameSubscription: Subscription = null;
  _isReady: boolean = false;
  @Output() leaveRoom = new EventEmitter<void>();

  @Input() set gameObservable(newGameObservable) {
    if (newGameObservable === this._gameObservable) return;

    this._gameObservable = newGameObservable;
    if (this._gameSubscription) this._gameSubscription.unsubscribe();

    this._gameSubscription = this._gameObservable.subscribe(
      (gameStateUpdate: GameState | null) =>
        gameStateUpdate === null
          ? this.handleLeave()
          : this.processGameEvent(gameStateUpdate)
    );
  }

  constructor(
    private gameService: GameService,
    private onlineGameService: OnlineGameService
  ) {}

  ngAfterViewInit(): void {
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

  private processGameEvent({ fen, ready, checkmate, turn }: GameState) {
    this._isReady = ready;
    this.gameService.processMove({ fen, checkmate });
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

  get turn(): Player {
    // return this.gameService.gameState.turn;
    if (!this.gameService.gameState.fen) return Player.WHITE;
    let splittedArr = this.gameService.gameState.fen.split(' ');
    return splittedArr[splittedArr.length - 5] == 'w'
      ? Player.WHITE
      : Player.BLACK;
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

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    this.handleLeave();
  }

  ngOnDestroy() {
    this.handleLeave();
  }
}
