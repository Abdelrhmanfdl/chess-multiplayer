import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from 'src/enums/Player';

@Component({
  selector: 'app-online-room-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent {
  @Input() gameId: string = null;
  @Input() playerType: Player | null = null;
  @Input() turn: Player;
  @Input() isCheckmate: boolean;
  @Output() reset = new EventEmitter<void>();
  @Output() leave = new EventEmitter<void>();

  handleReset() {
    this.reset.emit();
  }

  handleLeave() {
    this.leave.emit();
  }

  get isWhitePlayer(): boolean {
    return this.playerType === Player.WHITE;
  }

  get isMyTurn(): boolean {
    return this.turn == this.playerType;
  }

  get amIWinner(): boolean {
    return this.isCheckmate && this.isMyTurn;
  }

  get amILoser(): boolean {
    return this.isCheckmate && !this.isMyTurn;
  }
}
