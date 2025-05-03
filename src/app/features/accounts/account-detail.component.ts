import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  NgbAlertModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from './account.service';
import { AccountEntity } from './account.entity';
import { CustomerService } from '../customers/customer.service';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-account-detail',
  imports: [CommonModule, RouterLink, NgbAlertModule, NgbProgressbarModule],
  template: `
    <div class="container">
      <h1>Account Details</h1>
      <a
        class="btn btn-outline-secondary mb-3"
        [routerLink]="['/customers', customerId, 'accounts']"
        >Back to Accounts</a
      >
      @if (errorMessage.value) {
      <ngb-alert type="danger" [dismissible]="false">
        {{ errorMessage.value }}
      </ngb-alert>
      } @else if (!account.value) {
      <ngb-progressbar
        type="primary"
        [animated]="true"
        [value]="100"
      ></ngb-progressbar>
      } @else {
      <div class="card">
        <div class="card-header">
          Account: {{ account.value.accountNumber }}
        </div>
        <div class="card-body">
          <p><strong>ID:</strong> {{ account.value.id }}</p>
          <p>
            <strong>Customer:</strong> {{ customerName.value || 'Loading...' }}
          </p>
          <p>
            <strong>Account Number:</strong> {{ account.value.accountNumber }}
          </p>
          <p>
            <strong>Balance:</strong> {{ account.value.balance | currency }}
          </p>
        </div>
      </div>
      }
    </div>
  `,
  styles: `
    .container {
      padding: 20px;
      max-width: 100%;
    }
    h1 {
      margin-bottom: 20px;
      text-align: center;
    }
    .card {
      max-width: 600px;
      margin: 0 auto;
    }
    ngb-progressbar {
      margin: 20px 0;
    }
    ngb-alert {
      max-width: 600px;
      margin: 20px auto;
    }
  `,
})
export class AccountDetailComponent {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private customerService = inject(CustomerService);
  account = new BehaviorSubject<AccountEntity | null>(null);
  customerName = new BehaviorSubject<string | null>(null);
  errorMessage = new BehaviorSubject<string | null>(null);
  customerId: string;

  constructor() {
    this.customerId = this.route.snapshot.paramMap.get('customerId')!;
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const accountId = params.get('accountId')!;
          this.errorMessage.next(null);
          return this.accountService
            .fetchAccount(this.customerId, accountId)
            .pipe(
              catchError((err) => {
                this.errorMessage.next(err.message || 'Failed to load account');
                return of(null);
              })
            );
        })
      )
      .subscribe((account) => {
        this.account.next(account);
        if (account) {
          this.customerService.fetchCustomers().subscribe((customers) => {
            const customer = customers.find((c) => c.id === account.customerId);
            this.customerName.next(
              customer
                ? `${customer.firstName} ${customer.lastName}`
                : 'Unknown'
            );
          });
        }
      });
  }
}
