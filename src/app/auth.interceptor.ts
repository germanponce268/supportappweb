import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
/*se intercepta el request para clonar y agregar el token de authorizacion en en caso
de que no sea los endpoints de login , registro o cambio de password de usuario */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService : AuthenticationService) {}

    intercept(request: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>>{
      if(request.url.includes(`${this.authService.host}/user/login`)){
        return handler.handle(request);
      }
      if(request.url.includes(`${this.authService.host}/user/register`)){
        return handler.handle(request);
      }
      if(request.url.includes(`${this.authService.host}/user/resetpassword`)){
        return handler.handle(request);
      }
      this.authService.loadToken();
      const token = this.authService.getToken();
      const req = request.clone({setHeaders : {Authorization : `Bearer ${token}`}}) 
      return handler.handle(req);
  }

}