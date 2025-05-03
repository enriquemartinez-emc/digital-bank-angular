import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountListComponent } from './account-list.component';
import { AccountCreateComponent } from './account-create.component';
import { AccountDetailComponent } from './account-detail.component';

const routes: Routes = [
  { path: '', component: AccountListComponent },
  { path: 'new', component: AccountCreateComponent },
  { path: ':id', component: AccountDetailComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AccountListComponent,
    AccountCreateComponent,
    AccountDetailComponent,
  ],
  exports: [RouterModule],
})
export class AccountsModule {}
