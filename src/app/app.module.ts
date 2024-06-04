import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { OnlineComponent } from './online/online.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChessBoardComponent,
    NavbarComponent,
    OnlineComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChessBoardModule.forRoot(),
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
