import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }
      const tokenExpirationDate = this.getTokenExpirationDate(token);
      const isTokenExpired = tokenExpirationDate
        ? tokenExpirationDate < new Date()
        : true;
      return isTokenExpired;
    } catch (error) {
      console.log(error);
      console.log('blaaaa');
      return false;
    }
  }

  getTokenExpirationDate(token: string): Date | null {
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded token:', decoded);
      if (decoded.exp === undefined) {
        console.log("fhgfhgjfhgj")
        return null;
      }

      const date = new Date(0); // Initialize date object to epoch
      date.setUTCSeconds(decoded.exp); // Set the expiration time
      console.log(date);
      return date;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
