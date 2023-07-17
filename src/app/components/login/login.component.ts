import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Route, Router } from "@angular/router";
import { Subscription } from "rxjs";
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
    
    constructor(private router: Router ,private authService: AuthenticationService, private notificationService: NotificationService){}
    
    ngOnInit(): void {
        if(this.authService.isLoggedIn()){
            this.router.navigateByUrl('/user/management');
        }else{
            this.router.navigateByUrl('/login');
        }
        console.log("ha iniciado");
        this.loginForm = new FormGroup({
            username: new FormControl<string>(''),
            password: new FormControl<string>('')
        })
    }

    onLogin(user: User){
       const suscription = this.authService.login(user)
                                            .subscribe((resp:HttpResponse<any>)=>{
                                                const token = resp.headers.get('Jwt-Token');
                                                this.authService.saveToken(token);
                                                this.authService.addUserToLocalCache(resp.body);
                                                this.router.navigateByUrl('user/management');
                                                this.showLoading = false;
       },(error: HttpErrorResponse){
        console.log(error);
        
       }) 
        this.showLoading = true;
        this.subscriptions.push(suscription);
    }
    private sendErrorNotification(notificationType: NotificationType, message: string){
    if(message){
        this.notificationService.notify(notificationType, message);
    }else{
        this.notificationService.notify(notificationType, 'Ha ocurrido un error, por favor intenta de nuevo')
    }
    }

    submit(){
        const {username, password} = this.loginForm.value;
        console.log(username, password);
       // this.authService.login()   
    }
    
}