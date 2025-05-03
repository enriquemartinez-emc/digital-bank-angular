import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './customer.entity';

@Component({
  standalone: true,
  selector: 'app-customer-create',
  imports: [CommonModule, ReactiveFormsModule, NgbToastModule, RouterLink],
  template: `
    <div class="container">
      <h1>Create Customer</h1>
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="needs-validation"
        novalidate
      >
        <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input
            id="firstName"
            class="form-control"
            formControlName="firstName"
            required
            [ngClass]="{
              'is-invalid':
                form.get('firstName')?.invalid && form.get('firstName')?.touched
            }"
          />
          @if (form.get('firstName')?.invalid && form.get('firstName')?.touched)
          {
          <div class="invalid-feedback">First Name is required</div>
          }
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input
            id="lastName"
            class="form-control"
            formControlName="lastName"
            required
            [ngClass]="{
              'is-invalid':
                form.get('lastName')?.invalid && form.get('lastName')?.touched
            }"
          />
          @if (form.get('lastName')?.invalid && form.get('lastName')?.touched) {
          <div class="invalid-feedback">Last Name is required</div>
          }
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            class="form-control"
            formControlName="email"
            required
            [ngClass]="{
              'is-invalid':
                form.get('email')?.invalid && form.get('email')?.touched
            }"
          />
          @if (form.get('email')?.invalid && form.get('email')?.touched) {
          <div class="invalid-feedback">Valid email is required</div>
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
          <a class="btn btn-danger" [routerLink]="['/customers']">Cancel</a>
        </div>
      </form>
      @for (toast of toasts; track toast.id) {
      <ngb-toast
        [class]="toast.classname"
        [autohide]="true"
        [delay]="3000"
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
    .form-control {
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
export class CustomerCreateComponent {
  fb = inject(FormBuilder);
  customerService = inject(CustomerService);
  router = inject(Router);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  toasts: { id: number; message: string; classname: string }[] = [];
  private toastId = 0;

  onSubmit() {
    const customer = CustomerEntity.create({
      firstName: this.form.get('firstName')?.value || '',
      lastName: this.form.get('lastName')?.value || '',
      email: this.form.get('email')?.value || '',
    });
    this.customerService.createCustomer(customer).subscribe({
      next: () => {
        this.toasts.push({
          id: this.toastId++,
          message: 'Customer created successfully',
          classname: 'bg-success text-white',
        });
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        this.toasts.push({
          id: this.toastId++,
          message: err,
          classname: 'bg-danger text-white',
        });
      },
    });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
