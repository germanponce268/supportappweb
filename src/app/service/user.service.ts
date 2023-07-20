import { Injectable } from '@angular/core';
import{HttpClient, HttpErrorResponse, HttpEvent, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { CustomHttpResponse } from '../model/custom-http-response';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;
  constructor(private http : HttpClient) { }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(`${this.host}/user/list`);
  }
  addUSer(formData : FormData): Observable<User>{
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }
  
  updateUSer(formData : FormData): Observable<User>{
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }
  
  resetPassword(email : string): Observable<CustomHttpResponse | HttpErrorResponse>{
    return this.http.get<CustomHttpResponse>(`${this.host}/user/resetPassword/${email}`);
  }
  updateProfileImage(formData : FormData): Observable<HttpEvent<User>>{
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
     {
      reportProgress : true,
      observe : 'events'
    });
  }
  deleteUser(userId : number): Observable<CustomHttpResponse | HttpErrorResponse>{
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${userId}`);
  }

  addUserToLocalCache(users : User[]) : void{
    localStorage.setItem('users' , JSON.stringify(users));
  }

  getUsersFromLocalCache(): User[] | null{
    if(localStorage.getItem('users')){
      return JSON.parse(localStorage.getItem('users')!);
    }
      return null;
  }

  createUserFromData(loggedInUsername : string , user : User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUSername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastname);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage',profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;

  }
}
