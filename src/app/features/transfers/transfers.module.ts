import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferListComponent } from './transfer-list.component';
import { TransferCreateComponent } from './transfer-create.component';
import { TransferDetailComponent } from './transfer-detail.component';

const routes: Routes = [
  { path: '', component: TransferListComponent },
  { path: 'new', component: TransferCreateComponent },
  { path: ':id', component: TransferDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TransferListComponent,
    TransferCreateComponent,
    TransferDetailComponent
  ],
  exports: [RouterModule]
})
export class TransfersModule {}