import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// If we don't make this injectable, then it's never able to be utilized and will never handle our errors.
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // our router gives us access to navigation functionality so we'll be able to redirect the user to somewhere else
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // what we're going to want to do is catch any errors inside the response coming back from our API.
    // And that will give us an opportunity to do something with the particular errors.
    return next.handle(request).pipe(
      catchError(error => {
        if(error){
          if(error.status === 400){
            this.toastr.error(error.error.message, error.error.statusCode)
          }
          if(error.status === 401){
            this.toastr.error(error.error.message, error.error.statusCode)
          }
          if(error.status === 404){
            this.router.navigateByUrl('/not-found');
          }
          if(error.status === 500){
            this.router.navigateByUrl('/server-error');
          }
        }
        return throwError(() => error);
      })
    );
  }
}
