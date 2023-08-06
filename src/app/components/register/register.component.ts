import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit , OnDestroy{
  public registerForm : FormGroup;
  public showLoading : boolean;
  private subscriptions: Subscription[] = [];

  constructor(private authService : AuthenticationService, private notificationService : NotificationService, private router: Router) {
    this.showLoading = false;
    this.registerForm = new FormGroup({
    firstName : new FormControl<string>(''),
    lastName : new FormControl<string>(''),
    username : new FormControl<string>(''),
    email : new FormControl<string>('')
    })
   }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigateByUrl('/user/management');
    }
  }
  onRegister(user: User): void{
    this.showLoading = true;
    this.subscriptions.push(this.authService.register(user)
                        .subscribe((resp : User)=>{
                        this.showLoading = false;
                        this.sendNotification(NotificationType.SUCCESS, `Se ha creado una nueva cuanta para ${resp.firstName}, por favor verifica tu correo`)
                        },(errorResponse: HttpErrorResponse)=>{
                          console.log(errorResponse);
                          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
                          this.showLoading = false;
                         } )) 
    
   }
   private sendNotification(notificationType: NotificationType, message: string): void{
    if(message){
        this.notificationService.notify(notificationType, message.toLowerCase());
    }else{
        this.notificationService.notify(notificationType, 'Ha ocurrido un error, por favor intenta de nuevo')
    }
}
}
