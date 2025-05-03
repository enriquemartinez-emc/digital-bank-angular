import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardsComponent } from './cards.component';

const routes: Routes = [{ path: '', component: CardsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), CardsComponent],
  exports: [RouterModule],
})
export class CardsModule {}
