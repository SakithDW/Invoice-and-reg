import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { salesdata } from '../models/salesdata';
import { products } from '../models/products';
 

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  apiUrl:string = "https://localhost:7071/api/Auth/";
  constructor(private http :HttpClient) {

  }

  login(obj : any){
    return this.http.post(this.apiUrl+"login",obj)
    .pipe(
      tap((res:any)=>{
        if(res.token){
          localStorage.setItem('token',res.token);
        }
        else{
          throw new Error("Token not in response");
        }
      }),
      catchError(this.handleError)
    );
  }
  register(obj: any) {
    return this.http.post(this.apiUrl + "register", obj)
      .pipe(
        tap((res: any) => {
          console.log('User registered successfully', res);
        }),
        catchError(this.handleError)
      );
  }
  
  private handleError(error: any) {
    console.error('API error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }

   loadProducts(){
    return this.http.get<products[]>("http://localhost:3000/products")
  }

   loadSalesData(){
    return this.http.get<salesdata[]>("http://localhost:3000/sales")
  }

}
