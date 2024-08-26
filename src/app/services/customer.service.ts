import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../models/contacts.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = "https://localhost:7071/api/Auth/";

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/Contact`);
  }

  getCustomerById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/Contact/${id}`);
  }

  addCustomer(customer: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/Contact`, customer);
  }

  updateCustomer(id: string, customer: Contact): Observable<Contact> {
    return this.http.post<Contact>(`${this.apiUrl}/Contact/edit/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Contact/${id}`);
  }

}
