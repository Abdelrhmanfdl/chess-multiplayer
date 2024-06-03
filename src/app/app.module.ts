import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { NgxChessBoardModule } from 'ngx-chess-board';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'chess-board', component: ChessBoardComponent },
];

@NgModule({
  declarations: [AppComponent, HomeComponent, ChessBoardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forChild(routes),
    NgxChessBoardModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
