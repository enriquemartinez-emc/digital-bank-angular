import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgbCollapseModule,
    NgbNavModule,
  ],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">DigitalBank</a>
        <button
          class="navbar-toggler"
          type="button"
          (click)="isMenuCollapsed.set(!isMenuCollapsed())"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" [ngbCollapse]="isMenuCollapsed()">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/customers"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
                >Customers</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/accounts"
                routerLinkActive="active"
                >Accounts</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/cards" routerLinkActive="active"
                >Cards</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                routerLink="/transfers"
                routerLinkActive="active"
                >Transfers</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: `
    .navbar {
      padding: 1rem;
    }
    .navbar-brand {
      font-weight: 600;
      font-size: 1.5rem;
    }
    .nav-link {
      color: white !important;
      transition: background-color 0.3s;
      border-radius: 5px;
      padding: 0.5rem 1rem;
      margin: 0 0.25rem;
    }
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: 500;
    }
    @media (max-width: 768px) {
      .content-container {
        margin: 1rem;
        padding: 1rem;
      }
    }
  `,
})
export class AppLayoutComponent {
  isMenuCollapsed = signal(true);
}
