import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:5176/api/auth';
  isAuthenticated = signal(false);

  constructor(private http: HttpClient) {
    // Assume authenticated if a previous session exists (cookie-based)
    this.isAuthenticated.set(false); // Will be validated by API calls
  }

  login(username: string, password: string): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.apiUrl}/login`,
        { username, password },
        { withCredentials: true }
      )
      .pipe(tap(() => this.isAuthenticated.set(true)));
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.apiUrl}/logout`,
        {},
        { withCredentials: true }
      )
      .pipe(tap(() => this.isAuthenticated.set(false)));
  }
}
