import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-accounts',
  imports: [CommonModule],
  template: `
    <div class="container text-center">
      <h1>Accounts</h1>
      <p class="lead text-muted">Coming Soon</p>
    </div>
  `,
  styles: `
    .container {
      padding: 2rem;
    }
    h1 {
      margin-bottom: 1rem;
    }
  `,
})
export class AccountsComponent {}
