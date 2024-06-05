import { Component, OnInit, ViewChild } from '@angular/core';
import { MoveChange } from 'ngx-chess-board';
import { NgxChessBoardService, NgxChessBoardView } from 'ngx-chess-board';
import { GameEvent } from 'src/enums/GameEvent';
import { Player } from 'src/enums/Player';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.css'],
})
export class ChessBoardComponent implements OnInit {
  playerType: Player;

  @ViewChild('board', { static: false }) ngxBoard: NgxChessBoardView;

  constructor(ngxChessBoardService: NgxChessBoardService) {}

  ngOnInit(): void {
    window.addEventListener('message', (event) => {
      if (event.origin !== window.origin) {
        return;
      }
      switch (event.data.messageType) {
        case GameEvent.SETUP:
          console.log(`board ${this.playerType} got SETUP`, event.data);
          this.setup(event.data);
          break;
        case GameEvent.MOVE:
          console.log(`board ${this.playerType} got MOVE`, event.data);
          this.processOpponentMove(event.data.fen);
          break;
        case GameEvent.RESET:
          console.log(`board ${this.playerType} got RESET`, event.data);
          this.reset();
          break;
      }
    });
  }

  setup(setupData: any) {
    if (setupData.fen) this.ngxBoard.setFEN(setupData.fen);
    this.receivePlayerView(setupData.player);
  }

  receivePlayerView(player: Player) {
    this.playerType = player;
    if (this.playerType === Player.BLACK) this.ngxBoard.reverse();
  }

  onMove(move: MoveChange) {
    const isMyMove: boolean =
      ((move as any).color == 'white' && this.playerType === Player.WHITE) ||
      ((move as any).color == 'black' && this.playerType === Player.BLACK);
    if (isMyMove)
      window.parent.postMessage({ messageType: GameEvent.MOVE, move });
  }

  private processOpponentMove(updatedFen: string) {
    this.ngxBoard.setFEN(updatedFen);
    if (!this.isWhitePlayer) this.ngxBoard.reverse();
  }

  reset() {
    this.ngxBoard.reset();
    if (!this.isWhitePlayer) this.ngxBoard.reverse();
  }

  get isWhitePlayer() {
    return this.playerType === Player.WHITE;
  }
}
