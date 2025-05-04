import { Routes } from '@angular/router';
import { CustomerListComponent } from './features/customers/customer-list.component';
import { CustomerCreateComponent } from './features/customers/customer-create.component';
import { CustomerDetailComponent } from './features/customers/customer-detail.component';
import { LandingComponent } from './shared/components/landing.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'customers',
    component: CustomerListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customers/new',
    component: CustomerCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customers/:id',
    component: CustomerDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./features/accounts/accounts.module').then(
        (m) => m.AccountsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'cards',
    loadChildren: () =>
      import('./features/cards/cards.module').then((m) => m.CardsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'transfers',
    loadChildren: () =>
      import('./features/transfers/transfers.module').then(
        (m) => m.TransfersModule
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
