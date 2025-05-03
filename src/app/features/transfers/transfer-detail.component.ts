import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TransferService } from './transfer.service';
import { TransferEntity } from './transfer.entity';
import { map, switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-transfer-detail',
  imports: [CommonModule, RouterLink, NgbProgressbarModule],
  template: `
    <div class="container">
      @if (transfer) {
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Transfer {{ transfer.id }}</h3>
        </div>
        <div class="card-body">
          <p><strong>Customer ID:</strong> {{ transfer.customerId }}</p>
          <p><strong>From Account:</strong> {{ transfer.fromAccountId }}</p>
          <p><strong>To Account:</strong> {{ transfer.toAccountId }}</p>
          <p><strong>Amount:</strong> {{ transfer.amount | currency }}</p>
          <p><strong>Date:</strong> {{ transfer.date | date : 'short' }}</p>
        </div>
        <div class="card-footer text-end">
          <a class="btn btn-danger" [routerLink]="['/transfers']">Back</a>
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
export class TransferDetailComponent {
  route = inject(ActivatedRoute);
  transferService = inject(TransferService);
  transfer: TransferEntity | null = null;

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')!),
        switchMap((id) => this.transferService.fetchTransfer(id))
      )
      .subscribe((transfer) => (this.transfer = transfer));
  }
}
