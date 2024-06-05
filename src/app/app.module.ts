import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/firebase';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { OnlineComponent } from './online/online.component';
import { MenuComponent } from './online/menu/menu.component';
import { RoomComponent } from './online/room/room.component';
import { PanelComponent } from './online/room/panel/panel.component';
import { GameIdComponent } from './online/room/panel/game-id/game-id.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChessBoardComponent,
    NavbarComponent,
    OnlineComponent,
    MenuComponent,
    RoomComponent,
    PanelComponent,
    GameIdComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChessBoardModule.forRoot(),
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
