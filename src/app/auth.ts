// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../environments/environment.development';
import { PROFILE } from '../utils/apiPaths';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = `${environment.apiUrl}${PROFILE}`;
  public isAuthenticated = false;

  constructor(private http: HttpClient) {}

  checkAuth(): Observable<boolean> {
    return this.http
      .get<{ verified: boolean }>(this.apiUrl, { withCredentials: true })
      .pipe(
        map((res) => {
          this.isAuthenticated = res.verified;
          return this.isAuthenticated;
        }),
        catchError((err) => {
          this.isAuthenticated = false;
          return of(false);
        })
      );
  }
}
