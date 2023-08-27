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
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-profile-searched',
  templateUrl: './profile-searched.component.html',
  styleUrls: ['./profile-searched.component.css']
})
export class ProfileSearchedComponent implements OnInit {

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
  public roleLabel!: string;

  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private router : Router,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService
              ) { }

  ngOnInit(): void {
    console.log('ESTAMOS EN EL profile-searched')
    this.user = this.userService.user;
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
  getEmail():string{
    return `${this.user.email}`
  }
  getUserId():string{
    return `${this.user.userId}`;
  }
  getFullName():string{
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  
  getUsername(){
    return `${this.user.username}`;
  }

  getRole():string{
    return this.capitalizationRole(this.user.role.toLowerCase());
  }

  lockedLabel():string{
    if(this.isUserLocked()){
      return 'NO';
    }
    return 'SI';
  }

  isUserLocked():boolean{
    return this.user.notLocked;
  }
  capitalizationRole(role: string):string{
    const words = role.split('_');
    const word = words.map((word)=>word.charAt(0).toUpperCase() + word.slice(1))
    console.log(word);
    return word.join(' ');
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
    if(this.authenticationService.isAdmin){
      this.displayModal = true;
    }else{
      this.sendNotification(NotificationType.INFO, "No tienes los permisos para editar al usuario")
    }
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
