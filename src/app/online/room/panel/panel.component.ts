import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-online-room-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
})
export class PanelComponent {
  @Input() gameId: string = null;
  @Output() leave = new EventEmitter<void>();

  handleLeave() {
    this.leave.emit();
  }
}
