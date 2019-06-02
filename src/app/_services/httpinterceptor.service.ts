import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import {Observable} from 'rxjs';
declare const alertify:any
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private _router:Router){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = request.clone({
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'x-access-token':localStorage.getItem('token') || ''

      })
    });

    return next.handle(authReq).pipe(
      tap(event=>{}, error => {
          if (error.status === 401) {
            alertify.error(
              'We have an authentication problem. Please try again.'
            );
            localStorage.removeItem('token');
            this._router.navigate(['/'])
          }
        }
      ),

      // Log when response observable either completes or errors
      finalize(() => {

      })
    );
  }
}
