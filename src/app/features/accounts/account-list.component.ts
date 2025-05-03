// src/app/domains/accounts/presentation/account-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from './account.service';
import { CustomerService } from '../customers/customer.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-account-list',
  imports: [
    CommonModule,
    RouterLink,
    NgbProgressbarModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="container">
      <h1>Accounts</h1>
      <div class="mb-3">
        <label for="customerSelect" class="form-label">Select Customer</label>
        <select
          id="customerSelect"
          class="form-select"
          [formControl]="customerControl"
          (change)="onCustomerChange($event)"
        >
          <option value="">Select a customer</option>
          @for (customer of customers(); track customer.id) {
          <option [value]="customer.id">
            {{ customer.firstName }} {{ customer.lastName }}
          </option>
          }
        </select>
      </div>
      <a class="btn btn-primary mb-3" [routerLink]="['new']">Add Account</a>
      @if (!customerControl.value) {
      <p class="text-muted">Please select a customer to view their accounts.</p>
      } @else if (accounts().length === 0) {
      <ngb-progressbar
        type="primary"
        [animated]="true"
        [value]="100"
      ></ngb-progressbar>
      } @else {
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Account Number</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (account of accounts(); track account.id) {
          <tr>
            <td>{{ account.id }}</td>
            <td>{{ account.accountNumber }}</td>
            <td>{{ account.balance | currency }}</td>
            <td>
              <a
                class="btn btn-outline-secondary btn-sm"
                [routerLink]="[account.id]"
                >View</a
              >
            </td>
          </tr>
          }
        </tbody>
      </table>
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
    .form-select {
      max-width: 300px;
    }
    ngb-progressbar {
      margin: 20px 0;
    }
    .table {
      width: 100%;
      margin-top: 20px;
    }
    .text-muted {
      margin-top: 20px;
      text-align: center;
    }
  `,
})
export class AccountListComponent {
  accountService = inject(AccountService);
  customerService = inject(CustomerService);
  accounts = this.accountService.accounts;
  customers = this.customerService.customers;
  customerControl = new FormControl('');

  constructor() {
    this.customerService.fetchCustomers().subscribe();
  }

  onCustomerChange(event: Event) {
    const customerId = (event.target as HTMLSelectElement).value;
    if (customerId) {
      this.accountService.fetchAccountsByCustomer(customerId).subscribe();
    } else {
      this.accounts.set([]);
    }
  }
}
