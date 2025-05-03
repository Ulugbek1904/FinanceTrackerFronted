import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5192/api'; 

  constructor(private http: HttpClient) { }

  login(credentials: { email: string; password: string }): Observable<{
    accessToken: string;
    refreshToken: string;
    expiryDate: string;
  }> {
    return this.http.post<{
      accessToken: string;
      refreshToken: string;
      expiryDate: string;
    }>(`${this.apiUrl}/auth/login`, credentials);
  }
  
}