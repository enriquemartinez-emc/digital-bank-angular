import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { TransferService } from './transfer.service';
import { TransferEntity } from './transfer.entity';
import { CustomerService } from '../customers/customer.service';
import { AccountService } from '../accounts/account.service';
import { AccountEntity } from '../accounts/account.entity';

@Component({
  standalone: true,
  selector: 'app-transfer-create',
  imports: [CommonModule, ReactiveFormsModule, NgbToastModule, RouterLink],
  template: `
    <div class="container">
      <h1>Create Transfer</h1>
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="needs-validation"
        novalidate
      >
        <div class="mb-3">
          <label for="fromCustomerId" class="form-label">From Customer</label>
          <select
            id="fromCustomerId"
            class="form-select"
            formControlName="fromCustomerId"
            required
            (change)="onFromCustomerChange($event)"
            [ngClass]="{
              'is-invalid':
                form.get('fromCustomerId')?.invalid &&
                form.get('fromCustomerId')?.touched
            }"
          >
            <option value="">Select source customer</option>
            @for (customer of customers(); track customer.id) {
            <option [value]="customer.id">
              {{ customer.firstName }} {{ customer.lastName }}
            </option>
            }
          </select>
          @if (form.get('fromCustomerId')?.invalid &&
          form.get('fromCustomerId')?.touched) {
          <div class="invalid-feedback">Source customer is required</div>
          }
        </div>
        <div class="mb-3">
          <label for="fromAccountId" class="form-label">From Account</label>
          <select
            id="fromAccountId"
            class="form-select"
            formControlName="fromAccountId"
            required
            [ngClass]="{
              'is-invalid':
                form.get('fromAccountId')?.invalid &&
                form.get('fromAccountId')?.touched
            }"
          >
            <option value="">Select source account</option>
            @for (account of fromAccounts(); track account.id) {
            <option [value]="account.id">
              {{ account.accountNumber }} ({{ account.balance | currency }})
            </option>
            }
          </select>
          @if (form.get('fromAccountId')?.invalid &&
          form.get('fromAccountId')?.touched) {
          <div class="invalid-feedback">Source account is required</div>
          }
        </div>
        <div class="mb-3">
          <label for="toCustomerId" class="form-label">To Customer</label>
          <select
            id="toCustomerId"
            class="form-select"
            formControlName="toCustomerId"
            required
            (change)="onToCustomerChange($event)"
            [ngClass]="{
              'is-invalid':
                form.get('toCustomerId')?.invalid &&
                form.get('toCustomerId')?.touched
            }"
          >
            <option value="">Select destination customer</option>
            @for (customer of customers(); track customer.id) {
            <option [value]="customer.id">
              {{ customer.firstName }} {{ customer.lastName }}
            </option>
            }
          </select>
          @if (form.get('toCustomerId')?.invalid &&
          form.get('toCustomerId')?.touched) {
          <div class="invalid-feedback">Destination customer is required</div>
          }
        </div>
        <div class="mb-3">
          <label for="toAccountId" class="form-label">To Account</label>
          <select
            id="toAccountId"
            class="form-select"
            formControlName="toAccountId"
            required
            [ngClass]="{
              'is-invalid':
                form.get('toAccountId')?.invalid &&
                form.get('toAccountId')?.touched
            }"
          >
            <option value="">Select destination account</option>
            @for (account of toAccounts(); track account.id) {
            <option [value]="account.id">
              {{ account.accountNumber }} ({{ account.balance | currency }})
            </option>
            }
          </select>
          @if (form.get('toAccountId')?.invalid &&
          form.get('toAccountId')?.touched) {
          <div class="invalid-feedback">Destination account is required</div>
          }
        </div>
        <div class="mb-3">
          <label for="amount" class="form-label">Amount</label>
          <input
            id="amount"
            type="number"
            class="form-control"
            formControlName="amount"
            required
            [ngClass]="{
              'is-invalid':
                form.get('amount')?.invalid && form.get('amount')?.touched
            }"
          />
          @if (form.get('amount')?.invalid && form.get('amount')?.touched) {
          <div class="invalid-feedback">Amount must be positive</div>
          }
        </div>
        <div class="d-flex justify-content-center gap-2">
          <button
            class="btn btn-primary"
            type="submit"
            [disabled]="form.invalid"
          >
            Create
          </button>
          <a class="btn btn-danger" [routerLink]="['/transfers']">Cancel</a>
        </div>
      </form>
      @for (toast of toasts; track toast.id) {
      <ngb-toast
        [class]="toast.classname"
        [autohide]="true"
        [delay]="5000"
        (hidden)="removeToast(toast.id)"
      >
        {{ toast.message }}
      </ngb-toast>
      }
    </div>
  `,
  styles: `
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      margin-bottom: 20px;
      text-align: center;
    }
    .form-control, .form-select {
      margin-bottom: 10px;
    }
    .d-flex {
      margin-top: 20px;
    }
    ngb-toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
  `,
})
export class TransferCreateComponent {
  fb = inject(FormBuilder);
  transferService = inject(TransferService);
  customerService = inject(CustomerService);
  accountService = inject(AccountService);
  router = inject(Router);

  form = this.fb.group({
    fromCustomerId: ['', Validators.required],
    fromAccountId: ['', Validators.required],
    toCustomerId: ['', Validators.required],
    toAccountId: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
  });

  customers = this.customerService.customers;
  fromAccounts = signal<AccountEntity[]>([]);
  toAccounts = signal<AccountEntity[]>([]);
  toasts: { id: number; message: string; classname: string }[] = [];
  private toastId = 0;

  constructor() {
    this.customerService.fetchCustomers().subscribe();
  }

  onFromCustomerChange(event: Event) {
    const customerId = (event.target as HTMLSelectElement).value;
    if (customerId) {
      this.accountService
        .fetchAccountsByCustomer(customerId)
        .subscribe((accounts) => {
          this.fromAccounts.set(accounts);
          this.form.patchValue({ fromAccountId: '' });
        });
    } else {
      this.fromAccounts.set([]);
      this.form.patchValue({ fromAccountId: '' });
    }
  }

  onToCustomerChange(event: Event) {
    const customerId = (event.target as HTMLSelectElement).value;
    if (customerId) {
      this.accountService
        .fetchAccountsByCustomer(customerId)
        .subscribe((accounts) => {
          this.toAccounts.set(accounts);
          this.form.patchValue({ toAccountId: '' });
        });
    } else {
      this.toAccounts.set([]);
      this.form.patchValue({ toAccountId: '' });
    }
  }

  onSubmit() {
    const transfer = TransferEntity.create({
      fromAccountId: this.form.value.fromAccountId as string,
      toAccountId: this.form.value.toAccountId as string,
      amount: this.form.value.amount as number,
    });
    this.transferService.createTransfer(transfer).subscribe({
      next: () => {
        this.toasts.push({
          id: this.toastId++,
          message: 'Transfer created successfully',
          classname: 'bg-success text-white',
        });
        this.router.navigate(['/transfers']);
      },
      error: (err) => {
        const message = err.error?.detail || 'Failed to create transfer';
        this.toasts.push({
          id: this.toastId++,
          message,
          classname: 'bg-danger text-white',
        });
      },
    });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
