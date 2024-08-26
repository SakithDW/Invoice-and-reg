import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from './models/contacts.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  apiUrl: string = 'https://localhost:7071/api/Contact/';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }
}
