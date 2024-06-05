import { ElementRef, Injectable } from '@angular/core';
import { GameEvent } from 'src/enums/GameEvent';
import { Player } from 'src/enums/Player';
import { OnlineGameState } from 'src/types/OnlineGameState';

type BoardData = { iframe: ElementRef<HTMLIFrameElement>; playerType: Player };

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _boardsLits: BoardData[];
  private _gameState: OnlineGameState = {};

  constructor() {}

  initState(gameState: OnlineGameState) {
    if ('turn' in gameState) this._gameState.turn = gameState.turn;
    if ('fen' in gameState) this._gameState.fen = gameState.fen;
    if ('checkmate' in gameState)
      this._gameState.checkmate = gameState.checkmate;
  }

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

  processMove({ fen, checkmate }: { fen: string; checkmate: boolean }) {
    this._gameState.checkmate = checkmate;
    this._gameState.fen = fen;
    this.propagateStateToBoards();
    if (checkmate) {
      this._gameState.checkmate = true;
    } else {
      this._gameState.turn =
        this._gameState.turn == Player.WHITE ? Player.BLACK : Player.WHITE;
    }
  }

  reset() {
    this._gameState.turn = Player.WHITE;
    this._gameState.checkmate = false;
    this._gameState.fen = null;
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
