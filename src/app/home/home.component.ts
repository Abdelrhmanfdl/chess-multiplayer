import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { MoveChange } from 'ngx-chess-board';
import { GameEvent } from 'src/enums/GameEvent';
import { Player } from 'src/enums/Player';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('whitePlayerView') whitePlayerView:
    | ElementRef<HTMLIFrameElement>
    | undefined;
  @ViewChild('blackPlayerView') blackPlayerView:
    | ElementRef<HTMLIFrameElement>
    | undefined;

  stateKey = 'gameState';

  constructor(private gameService: GameService) {}

  ngAfterViewInit(): void {
    this.gameService.boards = [
      {
        iframe: this.whitePlayerView,
        playerType: Player.WHITE,
      },
      {
        iframe: this.blackPlayerView,
        playerType: Player.BLACK,
      },
    ];

    let fen, turn;
    try {
      let storedState = JSON.parse(localStorage.getItem(this.stateKey));
      fen = storedState.fen;
      turn = storedState.turn;
    } catch {}

    this.gameService.setupBoards(fen);

    window.addEventListener('message', (event) => {
      if (event.origin !== window.origin) return;
      switch (event.data.messageType) {
        case GameEvent.MOVE:
          this.gameService.processMove(event.data.move);
          localStorage.setItem(
            this.stateKey,
            JSON.stringify(this.gameService.gameState)
          );
          break;
      }
    });
  }

  reset() {
    this.gameService.reset();
    localStorage.removeItem(this.stateKey);
  }

  get isCheckMate(): boolean {
    return this.gameService.gameState.checkmate;
  }

  get turn(): Player {
    return this.gameService.gameState.turn;
  }

  get turnName(): string {
    return this.gameService.gameState.turn === Player.WHITE ? 'White' : 'Black';
  }

  resizeIFrameToFitContent(iFrame: HTMLIFrameElement) {
    // iFrame.width = iFrame.contentWindow?.document.body.scrollWidth + 'px';
    // iFrame.height = iFrame.contentWindow?.document.body.scrollHeight + 'px';
  }
}
