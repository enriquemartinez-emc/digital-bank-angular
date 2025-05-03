import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProblemDetails } from '../models/api-types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = 'http://localhost:5176/api';

  constructor(private http: HttpClient) {}

  getAll<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${endpoint}`).pipe(
      map((response) => response ?? []),
      catchError(this.handleError)
    );
  }

  getById<T>(endpoint: string, id: string): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create<T, U>(endpoint: string, data: U): Observable<string> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      map((response: any) => response.id ?? ''),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    const problemDetails: ProblemDetails = error.error;
    return throwError(
      () => new Error(`${problemDetails.title}: ${problemDetails.detail}`)
    );
  }
}
