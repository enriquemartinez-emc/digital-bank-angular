import { Routes } from '@angular/router';
import { CustomerListComponent } from './features/customers/customer-list.component';
import { CustomerCreateComponent } from './features/customers/customer-create.component';
import { CustomerDetailComponent } from './features/customers/customer-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/new', component: CustomerCreateComponent },
  { path: 'customers/:id', component: CustomerDetailComponent },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./features/accounts/accounts.module').then(
        (m) => m.AccountsModule
      ),
  },
  {
    path: 'cards',
    loadChildren: () =>
      import('./features/cards/cards.module').then((m) => m.CardsModule),
  },
  {
    path: 'transfers',
    loadChildren: () =>
      import('./features/transfers/transfers.module').then(
        (m) => m.TransfersModule
      ),
  },
];
