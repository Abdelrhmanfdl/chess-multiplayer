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
  @Output() leave = new EventEmitter<void>();

  handleLeave() {
    this.leave.emit();
  }

  get isWhitePlayer() {
    return this.playerType === Player.WHITE;
  }
}
