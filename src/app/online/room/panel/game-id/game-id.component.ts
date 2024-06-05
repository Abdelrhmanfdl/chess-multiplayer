import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-online-game-id',
  templateUrl: './game-id.component.html',
  styleUrls: ['./game-id.component.css'],
})
export class GameIdComponent {
  @Input() gameId: string;
  copyGameId() {
    navigator.clipboard
      .writeText(this.gameId)
      .then(() => {
        console.log('Game ID copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
      });
  }
}
