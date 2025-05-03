import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from './account.service';
import { AccountEntity } from './account.entity';
import { map, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-account-detail',
  imports: [CommonModule, RouterLink, NgbProgressbarModule],
  template: `
    <div class="container">
      @if (account) {
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Account {{ account.accountNumber }}</h3>
        </div>
        <div class="card-body">
          <p><strong>ID:</strong> {{ account.id }}</p>
          <p><strong>Customer ID:</strong> {{ account.customerId }}</p>
          <p><strong>Balance:</strong> {{ account.balance | currency }}</p>
        </div>
        <div class="card-footer text-end">
          <a class="btn btn-danger" [routerLink]="['/accounts']">Back</a>
        </div>
      </div>
      } @else {
      <ngb-progressbar
        type="primary"
        [animated]="true"
        [value]="100"
      ></ngb-progressbar>
      }
    </div>
  `,
  styles: `
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .card {
      margin-top: 20px;
    }
    ngb-progressbar {
      margin: 20px 0;
    }
    p {
      margin: 10px 0;
    }
  `,
})
export class AccountDetailComponent {
  route = inject(ActivatedRoute);
  accountService = inject(AccountService);
  account: AccountEntity | null = null;

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')!),
        switchMap((id) => this.accountService.fetchAccount(id))
      )
      .subscribe((account) => (this.account = account));
  }
}
