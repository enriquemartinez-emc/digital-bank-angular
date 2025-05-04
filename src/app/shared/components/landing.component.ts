import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-landing-login',
  imports: [CommonModule, NgbAlertModule, NgbNavModule, ReactiveFormsModule],
  template: `
    <div class="landing-container">
      <!-- Main Content -->
      <!-- Hero Section -->
      <div class="container hero-section">
        <div class="row align-items-center">
          <!-- Left: Text and Buttons -->
          <div class="col-lg-6 text-center text-lg-start">
            <h1 class="display-3 fw-bold">Browse all New Banking Smoothly</h1>
            <p class="lead mt-3">
              From easy money management, to travel perks and investments. Open
              your account in a flash.
            </p>
            <div class="mt-4">
              <button class="btn btn-primary btn-lg me-3">Get Started</button>
              <button class="btn btn-secondary btn-lg">See Demo</button>
            </div>
          </div>
          <div class="col-lg-6 mt-5 mt-lg-0">
            <!-- Login Form -->
            <div class="login-section">
              <div class="card mx-auto">
                <div class="card-header bg-primary text-white">
                  <h2 class="card-title">Log In to DigitalBank</h2>
                </div>
                <div class="card-body">
                  @if (errorMessage()) {
                  <ngb-alert
                    type="danger"
                    [dismissible]="true"
                    (closed)="errorMessage.set('')"
                  >
                    {{ errorMessage() }}
                  </ngb-alert>
                  }
                  <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
                    <div class="mb-3">
                      <label for="username" class="form-label">Username</label>
                      <input
                        id="username"
                        type="text"
                        class="form-control"
                        formControlName="username"
                        placeholder="Enter username"
                        [class.is-invalid]="
                          loginForm.get('username')?.invalid &&
                          loginForm.get('username')?.touched
                        "
                      />
                      @if (loginForm.get('username')?.invalid &&
                      loginForm.get('username')?.touched) {
                      <div class="invalid-feedback">Username is required</div>
                      }
                    </div>
                    <div class="mb-3">
                      <label for="password" class="form-label">Password</label>
                      <input
                        id="password"
                        type="password"
                        class="form-control"
                        formControlName="password"
                        placeholder="Enter password"
                        [class.is-invalid]="
                          loginForm.get('password')?.invalid &&
                          loginForm.get('password')?.touched
                        "
                      />
                      @if (loginForm.get('password')?.invalid &&
                      loginForm.get('password')?.touched) {
                      <div class="invalid-feedback">Password is required</div>
                      }
                    </div>
                    <div class="d-grid">
                      <button
                        type="submit"
                        class="btn btn-primary btn-lg"
                        [disabled]="loginForm.invalid"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .landing-container {
      min-height: 100vh;
      background: #f5f5f5;
      display: flex;
      flex-direction: column;
    }
    .hero-section {
      flex: 1;
      padding: 60px 0;
    }
    .hero-section h1 {
      color: #1e3a8a;
      line-height: 1.2;
    }
    .hero-section .lead {
      color: #4b5563;
      font-size: 1.25rem;
    }
    .login-section {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    @media (max-width: 576px) {
      .hero-section h1 {
        font-size: 2.5rem;
      }
      .hero-section .lead {
        font-size: 1rem;
      }
    }
  `,
})
export class LandingComponent {
  errorMessage = signal('');
  loginForm: FormGroup;
  private router = inject(Router);
  private fb = inject(FormBuilder);
  authService = inject(AuthService);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/customers']);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.error || 'Invalid credentials');
        },
      });
    } else {
      this.errorMessage.set('Please fill in all fields');
    }
  }
}
