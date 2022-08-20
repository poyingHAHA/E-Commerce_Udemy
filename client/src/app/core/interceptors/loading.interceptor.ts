import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable, delay } from 'rxjs';
import { BusyService } from '../services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method === 'POST' && request.url.includes('orders')) {
      return next.handle(request);
    }
    if(!request.url.includes('emailexists')){ // this will turn off the loading spinner when we're sending the url with emailexists
      return next.handle(request);
    }
    this.busyService.busy();
    return next.handle(request).pipe(
      delay(500),
      finalize(() => {
        this.busyService.idle();
      })
    )
  }
}
