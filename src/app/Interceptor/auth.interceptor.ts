import { HttpInterceptorFn } from '@angular/common/http';

import{
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
}from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class Authinterceptor implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if(token){
      req = req.clone({
        setHeaders:{
          Authorization : `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error:HttpErrorResponse)=>{
        if(error.status===401){
          console.error("Unauthorized Request: ",error)
        }
        return throwError(()=>error);
      })
    )
  }
  
}
