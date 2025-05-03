import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './customer.entity';
import { map, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-customer-detail',
  imports: [CommonModule, RouterLink, NgbProgressbarModule],
  template: `
    <div class="container">
      @if (customer) {
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            {{ customer.firstName }} {{ customer.lastName }}
          </h3>
        </div>
        <div class="card-body">
          <p><strong>ID:</strong> {{ customer.id }}</p>
          <p><strong>Email:</strong> {{ customer.email }}</p>
        </div>
        <div class="card-footer text-end">
          <a class="btn btn-danger" [routerLink]="['/customers']">Back</a>
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
export class CustomerDetailComponent {
  route = inject(ActivatedRoute);
  customerService = inject(CustomerService);
  customer: CustomerEntity | null = null;

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')!),
        switchMap((id) => this.customerService.fetchCustomer(id))
      )
      .subscribe((customer) => (this.customer = customer));
  }
}
