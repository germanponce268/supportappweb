import { Injectable } from '@angular/core';
import{HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import {JwtHelperService} from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public host = environment.apiUrl;
  private token!: string | null;
  private loggedInUsername!:string | null;
  private jwtHelper! : JwtHelperService;

  constructor(private http: HttpClient) {}

  login(user: User) : Observable<HttpResponse<any> | HttpErrorResponse>{
    return this.http.post<HttpResponse<any> | HttpErrorResponse>(`${this.host}/user/login`, user, {observe : 'response'})
  }
  register(user: User) : Observable<HttpResponse<any> | HttpErrorResponse>{
    return this.http.post<HttpResponse<any> | HttpErrorResponse>(`${this.host}/user/register`, user)
  }
  //remover los items del local storage
  logout(): void{
    this.token = null;
    this.loggedInUsername = null;
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }
  //guardar token en local storage
  saveToken(token : string): void{
    this.token = token;
    localStorage.setItem('token', token);
  }
  // agregar al usuario al cache local
  addUserToLocalCache(user : User): void{
    localStorage.setItem('user', JSON.stringify(user));//pasar objeto de tipo usuario a tipo string
  }
  //obtener el usuario del cache local
  getUserFromLocalCache(): User{
    return JSON.parse(localStorage.getItem('user')!);
  }
  //obteenr token del local storage
  loadToken(): void{
    this.token = localStorage.getItem('token');
  }

  getToken(): string{
    return this.token || 'No hay Token';
  }
  //checkear a traves del token si el usuario esta logueadojmkn  
  isLoggedIn(): boolean|undefined{
    this.loadToken();
    if(this.token != null && this.token !== ''){
      if(this.jwtHelper.decodeToken(this.token).sub != null || ''){
        if(!this.jwtHelper.isTokenExpired(this.token)){
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    }else{
      this.logout();
      return false
    }
  }

}