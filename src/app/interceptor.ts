import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('INtercepted');

    request = request.clone({
      // setHeaders: {
      //   Cookie: "sessionid=" + localStorage.getItem("session_id"),
      // },
      withCredentials: true,
    });
    return next.handle(request);
  }
}
