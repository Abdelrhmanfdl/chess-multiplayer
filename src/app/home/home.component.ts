import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
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

  ngAfterViewInit(): void {
    this.setupPostMessage(this.whitePlayerView, {
      messageType: GameEvent.SETUP,
      player: Player.WHITE,
    });
    this.setupPostMessage(this.blackPlayerView, {
      messageType: GameEvent.SETUP,
      player: Player.BLACK,
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
    iframe: ElementRef<HTMLIFrameElement> | undefined,
    data: any
  ): void {
    const iframeElement = iframe?.nativeElement;

    iframeElement?.addEventListener('load', () => {
      iframeElement.contentWindow?.postMessage(data);
    });
  }

  processMove(move: MouseEvent) {
    const iframeElement = (
      this.turn == Player.WHITE ? this.blackPlayerView : this.whitePlayerView
    )?.nativeElement;

    iframeElement?.contentWindow?.postMessage({
      messageType: GameEvent.MOVE,
      move,
    });

    this.turn = this.turn == Player.WHITE ? Player.BLACK : Player.WHITE;
  }

  resizeIFrameToFitContent(iFrame: HTMLIFrameElement) {
    // iFrame.width = iFrame.contentWindow?.document.body.scrollWidth + 'px';
    // iFrame.height = iFrame.contentWindow?.document.body.scrollHeight + 'px';
  }
}
