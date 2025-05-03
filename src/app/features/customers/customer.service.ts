import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerEntity } from './customer.entity';
import { ApiService } from '../../shared/services/api.service';
import { Customer, CreateCustomerCommand } from '../../shared/models/api-types';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  customers = signal<CustomerEntity[]>([]);
  private readonly apiService: ApiService;
  private readonly endpoint = 'customers';

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  fetchCustomers(): Observable<CustomerEntity[]> {
    return this.apiService.getAll<Customer>(this.endpoint).pipe(
      map((customers) => {
        const entities = customers.map(
          (c) => new CustomerEntity(c.id, c.firstName, c.lastName, c.email)
        );
        this.customers.set(entities);
        return entities;
      })
    );
  }

  fetchCustomer(id: string): Observable<CustomerEntity> {
    return this.apiService
      .getById<Customer>(this.endpoint, id)
      .pipe(
        map((c) => new CustomerEntity(c.id, c.firstName, c.lastName, c.email))
      );
  }

  createCustomer(customer: CustomerEntity): Observable<string> {
    if (!customer.validate()) {
      throw new Error('Invalid customer data');
    }
    const command: CreateCustomerCommand = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    };
    return this.apiService.create<Customer, CreateCustomerCommand>(
      this.endpoint,
      command
    );
  }
}
