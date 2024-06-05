import { ElementRef, Injectable } from '@angular/core';
import { MoveChange } from 'ngx-chess-board';
import { GameEvent } from 'src/enums/GameEvent';
import { Player } from 'src/enums/Player';
import { OnlineGameState } from 'src/types/OnlineGameState';

type BoardData = { iframe: ElementRef<HTMLIFrameElement>; playerType: Player };

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _boardsLits: BoardData[];
  private _gameState: OnlineGameState = { turn: Player.WHITE };

  constructor() {}

  setupBoards(fen?: string) {
    this._boardsLits.forEach(({ iframe, playerType }) => {
      const iframeElement = iframe?.nativeElement;
      iframeElement?.addEventListener('load', () => {
        iframeElement.contentWindow?.postMessage({
          messageType: GameEvent.SETUP,
          player: playerType,
          fen,
        });
      });
    });
  }

  processMove(move: MoveChange) {
    this._gameState.checkmate = move.checkmate;
    this._gameState.fen = move.fen;
    this.propagateStateToBoards();
    if (move.checkmate) {
      this._gameState.checkmate = true;
    } else {
      this._gameState.turn =
        this._gameState.turn == Player.WHITE ? Player.BLACK : Player.WHITE;
    }
  }

  reset() {
    this.gameState.turn = Player.WHITE;
    this.gameState.checkmate = false;
    this._boardsLits.forEach(({ iframe }) => {
      iframe.nativeElement?.contentWindow?.postMessage({
        messageType: GameEvent.RESET,
      });
    });
  }

  private propagateStateToBoards() {
    this._boardsLits.forEach(({ iframe }) => {
      iframe.nativeElement?.contentWindow?.postMessage({
        messageType: GameEvent.MOVE,
        fen: this._gameState.fen,
      });
    });
  }

  get gameState(): OnlineGameState {
    return this._gameState;
  }

  set boards(boards: BoardData[]) {
    this._boardsLits = boards;
  }
}
