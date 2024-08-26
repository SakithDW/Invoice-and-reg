import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = 'https://localhost:7071';

  constructor(private http: HttpClient) {}

  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/invoice`, invoiceData);
  }
}
