import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService : AuthenticationService) {}

  intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    if(request.url.includes(this.authService.host))
    return handler.handle(request);
  }
}
