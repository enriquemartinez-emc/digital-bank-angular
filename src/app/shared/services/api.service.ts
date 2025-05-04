import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProblemDetails } from '../models/api-types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = 'http://localhost:5176/api';

  constructor(private http: HttpClient) {}

  getAll<T>(endpoint: string): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.apiUrl}/${endpoint}`, { withCredentials: true })
      .pipe(
        map((response) => response ?? []),
        catchError(this.handleError)
      );
  }

  getById<T>(endpoint: string, id: string): Observable<T> {
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}/${id}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getWithQuery<T>(
    endpoint: string,
    params: { [key: string]: string | string[] }
  ): Observable<T[]> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).forEach((value) => {
          httpParams = httpParams.append(key, value);
        });
      } else {
        httpParams = httpParams.append(key, params[key] as string);
      }
    }
    return this.http
      .get<{ value: T[] } | T[]>(`${this.apiUrl}/${endpoint}`, {
        params: httpParams,
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          console.log('getWithQuery response:', response); // Debug log
          return this.extractValue<T[]>(response);
        }),
        catchError(this.handleError)
      );
  }

  create<T, U>(endpoint: string, data: U): Observable<string> {
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, data, { withCredentials: true })
      .pipe(
        map((response: any) => response.id ?? ''),
        catchError(this.handleError)
      );
  }

  private extractValue<T extends object>(response: { value: T } | T): T {
    return 'value' in response ? response.value : response;
  }

  private handleError(error: any): Observable<never> {
    const problemDetails: ProblemDetails = error.error;
    return throwError(
      () => new Error(`${problemDetails.title}: ${problemDetails.detail}`)
    );
  }
}
