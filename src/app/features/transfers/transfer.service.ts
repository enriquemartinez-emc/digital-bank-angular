import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransferEntity } from './transfer.entity';
import { ApiService } from '../../shared/services/api.service';
import { Transfer, CreateTransferCommand } from '../../shared/models/api-types';

@Injectable({ providedIn: 'root' })
export class TransferService {
  transfers = signal<TransferEntity[]>([]);
  private readonly apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  fetchTransfersByCustomer(customerId: string): Observable<TransferEntity[]> {
    return this.apiService
      .getAll<Transfer>(`transfers?customerId=${customerId}`)
      .pipe(
        map((transfers) => {
          const entities = transfers.map(
            (t) =>
              new TransferEntity(
                t.id,
                t.customerId || '', // Handle if customerId is not returned
                t.fromAccountId,
                t.toAccountId,
                t.amount,
                t.createdAt
              )
          );
          this.transfers.set(entities);
          return entities;
        })
      );
  }

  fetchTransfer(id: string): Observable<TransferEntity> {
    return this.apiService
      .getById<Transfer>('transfers', id)
      .pipe(
        map(
          (t) =>
            new TransferEntity(
              t.id,
              t.customerId || '',
              t.fromAccountId,
              t.toAccountId,
              t.amount,
              t.createdAt
            )
        )
      );
  }

  createTransfer(transfer: TransferEntity): Observable<string> {
    if (!transfer.validate()) {
      throw new Error('Invalid transfer data');
    }
    const command: CreateTransferCommand = {
      fromAccountId: transfer.fromAccountId,
      toAccountId: transfer.toAccountId,
      amount: transfer.amount,
    };
    return this.apiService.create<Transfer, CreateTransferCommand>(
      'transfers',
      command
    );
  }
}
