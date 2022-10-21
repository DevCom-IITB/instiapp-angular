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
    // let header = {};
    // if (localStorage.getItem("session_id")) {
    //   header = { Cookie: "sessionid=" + localStorage.getItem("session_id") };
    // }

    request = request.clone({
      //   setHeaders: header,
      withCredentials: true,
    });
    return next.handle(request);
  }
}
