import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from './account.service';
import { AccountEntity } from './account.entity';
import { CustomerService } from '../customers/customer.service';

@Component({
  standalone: true,
  selector: 'app-account-create',
  imports: [CommonModule, ReactiveFormsModule, NgbToastModule, RouterLink],
  template: `
    <div class="container">
      <h1>Create Account</h1>
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="needs-validation"
        novalidate
      >
        <div class="mb-3">
          <label for="customerId" class="form-label">Customer</label>
          <select
            id="customerId"
            class="form-select"
            formControlName="customerId"
            required
            [ngClass]="{
              'is-invalid':
                form.get('customerId')?.invalid &&
                form.get('customerId')?.touched
            }"
          >
            <option value="">Select a customer</option>
            @for (customer of customers(); track customer.id) {
            <option [value]="customer.id">
              {{ customer.firstName }} {{ customer.lastName }}
            </option>
            }
          </select>
          @if (form.get('customerId')?.invalid &&
          form.get('customerId')?.touched) {
          <div class="invalid-feedback">Customer is required</div>
          }
        </div>
        <div class="mb-3">
          <label for="accountNumber" class="form-label">Account Number</label>
          <input
            id="accountNumber"
            class="form-control"
            formControlName="accountNumber"
            required
            [ngClass]="{
              'is-invalid':
                form.get('accountNumber')?.invalid &&
                form.get('accountNumber')?.touched
            }"
          />
          @if (form.get('accountNumber')?.invalid &&
          form.get('accountNumber')?.touched) {
          <div class="invalid-feedback">Account Number is required</div>
          }
        </div>
        <div class="mb-3">
          <label for="initialBalance" class="form-label">Initial Balance</label>
          <input
            id="initialBalance"
            type="number"
            class="form-control"
            formControlName="initialBalance"
            required
            [ngClass]="{
              'is-invalid':
                form.get('initialBalance')?.invalid &&
                form.get('initialBalance')?.touched
            }"
          />
          @if (form.get('initialBalance')?.invalid &&
          form.get('initialBalance')?.touched) {
          <div class="invalid-feedback">
            Initial Balance must be non-negative
          </div>
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
          <a class="btn btn-danger" [routerLink]="['/accounts']">Cancel</a>
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
export class AccountCreateComponent {
  fb = inject(FormBuilder);
  accountService = inject(AccountService);
  customerService = inject(CustomerService);
  router = inject(Router);

  form = this.fb.group({
    customerId: ['', Validators.required],
    accountNumber: ['', Validators.required],
    initialBalance: [0, [Validators.required, Validators.min(0)]],
  });

  customers = this.customerService.customers;
  toasts: { id: number; message: string; classname: string }[] = [];
  private toastId = 0;

  constructor() {
    this.customerService.fetchCustomers().subscribe();
  }

  onSubmit() {
    const account = AccountEntity.create({
      customerId: this.form.value.customerId || '',
      accountNumber: this.form.value.accountNumber || '',
      initialBalance: this.form.value.initialBalance || 0,
    });
    this.accountService.createAccount(account).subscribe({
      next: () => {
        this.toasts.push({
          id: this.toastId++,
          message: 'Account created successfully',
          classname: 'bg-success text-white',
        });
        this.router.navigate(['/accounts']);
      },
      error: (err) => {
        const message = err.error?.detail || 'Failed to create account';
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
