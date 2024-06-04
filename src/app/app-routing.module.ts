import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { OnlineComponent } from './online/online.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'chess-board', component: ChessBoardComponent },
  { path: 'online', component: OnlineComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
