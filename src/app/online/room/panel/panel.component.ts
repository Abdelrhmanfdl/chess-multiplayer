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
  @Input() isCheckmate: boolean;
  @Output() reset = new EventEmitter<void>();
  @Output() leave = new EventEmitter<void>();

  handleReset() {
    this.reset.emit();
  }

  handleLeave() {
    this.leave.emit();
  }

  get isWhitePlayer() {
    return this.playerType === Player.WHITE;
  }
}
