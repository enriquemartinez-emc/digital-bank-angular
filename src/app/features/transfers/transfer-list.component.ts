import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TransferService } from './transfer.service';
import { TransferEntity } from './transfer.entity';
import { CustomerService } from '../customers/customer.service';
import { AccountService } from '../accounts/account.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-transfer-list',
  imports: [
    CommonModule,
    RouterLink,
    NgbProgressbarModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="container">
      <h1>Transfers</h1>
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
      <a class="btn btn-primary mb-3" [routerLink]="['new']">Add Transfer</a>
      @if (!customerControl.value) {
      <p class="text-muted">
        Please select a customer to view their transfers.
      </p>
      } @else if (transfers().length === 0) {
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
            <th>From Account</th>
            <th>From Customer</th>
            <th>To Account</th>
            <th>To Customer</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (transfer of enrichedTransfers(); track transfer.id) {
          <tr>
            <td>{{ transfer.id }}</td>
            <td>{{ transfer.fromAccountNumber }}</td>
            <td>{{ transfer.fromCustomerName }}</td>
            <td>{{ transfer.toAccountNumber }}</td>
            <td>{{ transfer.toCustomerName }}</td>
            <td>{{ transfer.amount | currency }}</td>
            <td>{{ transfer.date | date : 'yyyy-MM-dd hh:mm a' }}</td>
            <td>
              <a
                class="btn btn-outline-secondary btn-sm"
                [routerLink]="[transfer.id]"
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
export class TransferListComponent {
  transferService = inject(TransferService);
  customerService = inject(CustomerService);
  accountService = inject(AccountService);
  transfers = this.transferService.transfers;
  customers = this.customerService.customers;
  customerControl = new FormControl('');
  enrichedTransfers = signal<
    {
      id: string;
      fromAccountNumber: string;
      fromCustomerName: string;
      toAccountNumber: string;
      toCustomerName: string;
      amount: number;
      date: string;
    }[]
  >([]);
  private customerNameCache = new Map<string, string>();

  constructor() {
    this.customerService.fetchCustomers().subscribe((customers) => {
      customers.forEach((c) =>
        this.customerNameCache.set(c.id, `${c.firstName} ${c.lastName}`)
      );
    });
    effect(() => this.enrichTransfers(this.transfers()));
  }

  onCustomerChange(event: Event) {
    const customerId = (event.target as HTMLSelectElement).value;
    if (customerId) {
      this.transferService.fetchTransfersByCustomer(customerId).subscribe();
    } else {
      this.transfers.set([]);
    }
  }

  private enrichTransfers(transfers: TransferEntity[]) {
    if (!transfers.length) {
      this.enrichedTransfers.set([]);
      return;
    }

    const accountIds = Array.from(
      new Set([
        ...transfers.map((t) => t.fromAccountId),
        ...transfers.map((t) => t.toAccountId),
      ])
    );
    this.accountService.fetchAccountsByIds(accountIds).subscribe((accounts) => {
      const accountMap = new Map(
        accounts.map((a) => [
          a.id,
          {
            accountNumber: a.accountNumber,
            customerName: this.customerNameCache.get(a.customerId) || 'Unknown',
          },
        ])
      );
      const enriched = transfers.map((t) => ({
        id: t.id,
        fromAccountNumber:
          accountMap.get(t.fromAccountId)?.accountNumber || t.fromAccountId,
        fromCustomerName:
          accountMap.get(t.fromAccountId)?.customerName || 'Unknown',
        toAccountNumber:
          accountMap.get(t.toAccountId)?.accountNumber || t.toAccountId,
        toCustomerName:
          accountMap.get(t.toAccountId)?.customerName || 'Unknown',
        amount: t.amount,
        date: t.date,
      }));
      this.enrichedTransfers.set(enriched);
    });
  }
}
