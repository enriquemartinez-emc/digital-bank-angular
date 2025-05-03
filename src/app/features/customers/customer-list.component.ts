import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from './customer.service';

@Component({
  standalone: true,
  selector: 'app-customer-list',
  imports: [CommonModule, RouterLink, NgbProgressbarModule],
  template: `
    <div class="container-fluid">
      <h1>Customers</h1>
      <a class="btn btn-primary mb-3" [routerLink]="['new']">Add Customer</a>
      @if (customers().length === 0) {
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
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (customer of customers(); track customer.id) {
          <tr>
            <td>{{ customer.id }}</td>
            <td>{{ customer.firstName }}</td>
            <td>{{ customer.lastName }}</td>
            <td>{{ customer.email }}</td>
            <td>
              <a
                class="btn btn-outline-secondary btn-sm"
                [routerLink]="[customer.id]"
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
      max-width: 800px;
      margin: 0 auto;
    }
    h1 {
      margin-bottom: 20px;
      text-align: center;
    }
    ngb-progressbar {
      margin: 20px 0;
    }
    .table {
      width: 100%;
      margin-top: 20px;
    }
  `,
})
export class CustomerListComponent {
  customerService = inject(CustomerService);
  customers = this.customerService.customers;

  constructor() {
    this.customerService.fetchCustomers().subscribe();
  }
}
