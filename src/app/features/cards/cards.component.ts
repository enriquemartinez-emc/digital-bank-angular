// src/app/domains/cards/presentation/cards.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-cards',
  imports: [CommonModule],
  template: `
    <div class="container text-center">
      <h1>Cards</h1>
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
export class CardsComponent {}
