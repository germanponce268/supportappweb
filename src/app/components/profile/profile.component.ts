import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { RoleType } from 'src/app/enum/role-type.enum';
import { CustomHttpResponse } from 'src/app/model/custom-http-response';
import { Role } from 'src/app/model/role';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:[MessageService,ConfirmationService]
})
export class ProfileComponent implements OnInit {
  public user! : User;
  public image! : string;
  public displayModal :boolean = false;
  public displayModal2 :boolean = false;
  public editForm! : FormGroup;
  private currentUsername! : string;
  public roles: Role[] = [];
  public selectedRole!: string; 
  public reset! : FormGroup;
  public isAdmin: boolean = false;

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private router : Router,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService
              ) { }

  ngOnInit(): void {
    this.user = this.userService.user
    this.image = this.user.profileImageUrl;
    this.primengConfig.ripple = false;
    this.isAdmin = this.authenticationService.isAdmin;
    
    this.editForm = new FormGroup({
      firstName : new FormControl<string>(`${this.user.firstName}`),
      lastName : new FormControl<string>(`${this.user.lastName}`),
      username : new FormControl<string>(`${this.user.username}`),
      email : new FormControl<string>(`${this.user.email}`),
      role : new FormControl<string>(`${this.user.role}`)
    })
    this.roles = [
      {name: 'User',code: RoleType.USER},
      {name: 'Admin', code: RoleType.ADMIN},
      {name: 'Super Admin', code: RoleType.SUPER_ADMIN}
    ];
    this.reset = new FormGroup({
      email : new FormControl<string>('')
    })

   
  }

  getFullName(): string{
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  delete():void{
    if(this.authenticationService.isAdmin){
      this.confirmationService.confirm({
          message: 'Estas seguro de borrar al usuario?',
          header: 'Confirmacion',
          icon: 'pi pi-exclamation-triangle',
        accept:() => this.userService.deleteUser(this.user.id)
                                  .subscribe(resp => {
                                    this.sendNotification(NotificationType.SUCCESS, 'Se ha borrado al usuario con exito!');
                                    this.router.navigateByUrl('user/management');
                                  }),
        reject: () => console.log('Can')
      })
    }else{
      this.sendNotification(NotificationType.ERROR, "No tienes los permisos para borrar al usuario")
    }
   
  }
  editUser(){
    this.displayModal = true;
  }
  onEditUser(form: NgForm){
    this.currentUsername = this.user.username;
    this.editForm.value.role = this.selectedRole;
    console.log(this.currentUsername);
    const formData = this.userService.createUserFormData(this.currentUsername, this.editForm.value, null)
    this.userService.updateUSer(formData)
                      .subscribe((resp: User) =>{
                        this.sendNotification(NotificationType.SUCCESS, 'Editado exitosamente')
                        this.displayModal = false;
                        this.router.navigateByUrl('/user/management')
                      })
  }
  resetPassword(){
    this.displayModal2= true;
  }

  onResetPassword(){
  
    this.userService.resetPassword(this.reset.value.email)
                      .subscribe((resp : CustomHttpResponse | HttpErrorResponse)=>{
                        this.sendNotification(NotificationType.SUCCESS, 'Exito al resetear el password')
                        this.displayModal2 = false;
                      },(error)=>{
                        this.sendNotification(NotificationType.ERROR, error.error.message)
                        this.displayModal2 = false;
                      },
                      ()=>{
                        this.reset.reset();
                      })
  }

  private sendNotification(notificationType: NotificationType, message: string): void{
    if(message){
        this.notificationService.notify(notificationType, message);
    }else{
        this.notificationService.notify(notificationType, 'Ha ocurrido un error, por favor intenta de nuevo')
    }
  }
}
