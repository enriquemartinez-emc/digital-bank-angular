import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountEntity } from './account.entity';
import { ApiService } from '../../shared/services/api.service';
import {
  Account,
  AccountData,
  CreateAccountCommand,
} from '../../shared/models/api-types';

@Injectable({ providedIn: 'root' })
export class AccountService {
  accounts = signal<AccountEntity[]>([]);
  private readonly apiService: ApiService;
  private readonly endpoint = 'accounts';

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  fetchAccountsByCustomer(customerId: string): Observable<AccountEntity[]> {
    return this.apiService
      .getAll<Account>(`customers/${customerId}/accounts`)
      .pipe(
        map((accounts) => {
          const entities = accounts.map(
            (a) =>
              new AccountEntity(a.id, a.customerId, a.accountNumber, a.balance)
          );
          this.accounts.set(entities);
          return entities;
        })
      );
  }

  fetchAccount(id: string): Observable<AccountEntity> {
    return this.apiService
      .getById<Account>(this.endpoint, id)
      .pipe(
        map(
          (a) =>
            new AccountEntity(a.id, a.customerId, a.accountNumber, a.balance)
        )
      );
  }

  createAccount(account: AccountEntity): Observable<string> {
    if (!account.validate()) {
      throw new Error('Invalid account data');
    }
    const accountData: AccountData = {
      accountNumber: account.accountNumber,
      initialBalance: account.balance,
    };
    return this.apiService.create<Account, AccountData>(
      `customers/${account.customerId}/accounts`,
      accountData
    );
  }
}
