import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { MoveChange } from 'ngx-chess-board';
import { GameEvent } from 'src/enums/GameEvent';
import { Player } from 'src/enums/Player';

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

  turn: Player = Player.WHITE;
  isCheckMate: boolean = false;
  stateKey = 'gameState';

  ngAfterViewInit(): void {
    let storedState = localStorage.getItem(this.stateKey),
      fen;
    if (storedState) {
      let storedStateParsed = JSON.parse(storedState);
      fen = storedStateParsed.fen;
      this.turn = storedStateParsed.turn;
    }
    this.setupPostMessage(this.whitePlayerView, {
      messageType: GameEvent.SETUP,
      player: Player.WHITE,
      fen,
    });
    this.setupPostMessage(this.blackPlayerView, {
      messageType: GameEvent.SETUP,
      player: Player.BLACK,
      fen,
    });

    window.addEventListener('message', (event) => {
      if (event.origin !== window.origin) {
        return;
      }
      switch (event.data.messageType) {
        case GameEvent.MOVE:
          this.processMove(event.data.move);
          break;
      }
    });
  }

  private setupPostMessage(
    iframe: ElementRef<HTMLIFrameElement>,
    data: any
  ): void {
    const iframeElement = iframe?.nativeElement;

    iframeElement?.addEventListener('load', () => {
      iframeElement.contentWindow?.postMessage(data);
    });
  }

  reset() {
    this.turn = Player.WHITE;
    this.isCheckMate = false;
    localStorage.removeItem(this.stateKey);
    this.sendMessageToPlayer(Player.WHITE, { messageType: GameEvent.RESET });
    this.sendMessageToPlayer(Player.BLACK, { messageType: GameEvent.RESET });
  }

  private processMove(move: MoveChange) {
    this.propagateMove(move);
    if (move.checkmate) {
      this.isCheckMate = true;
      localStorage.removeItem(this.stateKey);
    } else {
      this.turn = this.turn == Player.WHITE ? Player.BLACK : Player.WHITE;
      localStorage.setItem(
        this.stateKey,
        JSON.stringify({
          turn: this.turn,
          fen: move.fen,
        })
      );
    }
  }

  private propagateMove(move: MoveChange) {
    this.sendMessageToPlayer(
      this.turn == Player.WHITE ? Player.BLACK : Player.WHITE,
      {
        messageType: GameEvent.MOVE,
        fen: move.fen,
      }
    );
  }

  private sendMessageToPlayer(player: Player, message: any) {
    const iframeElement = (
      player == Player.WHITE ? this.whitePlayerView : this.blackPlayerView
    )?.nativeElement;
    iframeElement?.contentWindow?.postMessage(message);
  }

  get turnName() {
    return this.turn === Player.WHITE ? 'White' : 'Black';
  }

  resizeIFrameToFitContent(iFrame: HTMLIFrameElement) {
    // iFrame.width = iFrame.contentWindow?.document.body.scrollWidth + 'px';
    // iFrame.height = iFrame.contentWindow?.document.body.scrollHeight + 'px';
  }
}
