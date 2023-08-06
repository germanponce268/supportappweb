import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {Router } from "@angular/router";
import { Subscription } from "rxjs";
import { HeaderType } from "src/app/enum/header-type.enum";
import { NotificationType } from "src/app/enum/notification-type.enum";
import { User } from "src/app/model/user";
import { AuthenticationService } from "src/app/service/authentication.service";
import { NotificationService } from "src/app/service/notification.service";
import { UserService } from "src/app/service/user.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
    public showLoading = false;
    private subscriptions: Subscription[] = [];
    public loginForm! : FormGroup;
    
    constructor(private router: Router ,private authService: AuthenticationService, private notificationService: NotificationService){
        this.loginForm = new FormGroup({
            username: new FormControl<string>(''),
            password: new FormControl<string>('')
        });
    }
    
    //si el usuario esta logueado ingreasa a la interfaz de usuario de lo contrario se lo redirecciona al login
    ngOnInit(): void {
        if(this.authService.isLoggedIn()){
            this.router.navigateByUrl('/user/management');
        }else{
            this.router.navigateByUrl('/login');
        }
        console.log("ha iniciado");
        //se inicializan los inputs
        this.loginForm = new FormGroup({
            username: new FormControl<string>(''),
            password: new FormControl<string>('')
        })
    }
    //en el login se guarda el token en cache junto con el usuario
    onLogin(user: User){
       const suscription = this.authService.login(user)
                                            .subscribe((resp:HttpResponse<any>)=>{
                                                const token = resp.headers.get(HeaderType.JWT_TOKEN);
                                                this.authService.saveToken(token);
                                                this.authService.addUserToLocalCache(resp.body);
                                                this.router.navigateByUrl('user/management');
                                                this.showLoading = false;
       },(errorResponse: HttpErrorResponse)=>{
        this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message)
       }) 
        this.showLoading = true;
        this.subscriptions.push(suscription);
    }


    private sendErrorNotification(notificationType: NotificationType, message: string): void{
        if(message){
            this.notificationService.notify(notificationType, message.toLowerCase());
        }else{
            this.notificationService.notify(notificationType, 'Ha ocurrido un error, por favor intenta de nuevo')
        }
    }


    ngOnDestroy(): void{    
        this.subscriptions.forEach(sub =>sub.unsubscribe);
    }
    
}