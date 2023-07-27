import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import {Router, RouterLink } from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { RoleType } from 'src/app/enum/role-type.enum';
import { Role } from 'src/app/model/role';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/enum/notification-type.enum';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
  styleUrls: ['./user.component.css'],
  providers:[MessageService,ConfirmationService,DialogService]
})
export class UserComponent implements OnInit {

    private user!: User;
    public users: User[] = [];
    public selectedUser!: User;
    public items: MenuItem[] = [];
    public displayModal: boolean = false;
    public addForm!: FormGroup;
    public roles: Role[] = [];
    public selectedRole!: string;  

    constructor(
      private userService: UserService, 
      private router: Router,
      private confirmationService: ConfirmationService,
      private notificationService: NotificationService
      ) { }

    ngOnInit() {
        this.userService.getUsers()
                            .subscribe(users => this.users = users);

        this.items = [
          {
            label: 'Ver',
            icon: 'pi pi-fw pi-search', command:
            () => this.viewUser(this.selectedUser)
          },
          {
            label: 'Borrar',
            icon: 'pi pi-fw pi-times', command:
            () => this.deleteSelectedUser(this.selectedUser)
          }
        ];

        this.addForm = new FormGroup({
          firstName: new FormControl<string>(''),
          lastName: new FormControl<string>(''),
          username: new FormControl<string>(''),
          email: new FormControl<string>('')
        })

        this.roles = [
          {name: 'User       ',code: RoleType.USER},
          {name: 'Admin', code: RoleType.ADMIN},
          {name: 'Super Admin', code: RoleType.SUPER_ADMIN}
        ];
    }
  deleteSelectedUser(selectedUser: User): void {
    this.confirmationService.confirm({
      message:'Estas seguro de borrar al usuario?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',  
      accept:()=>{
        this.userService.deleteUser(selectedUser.id)
                          .subscribe(resp => {
                            this.sendNotification(NotificationType.SUCCESS, 'Usuario borrado correctamente');
                            setTimeout(()=>{
                              location.reload();
                            },1000)
                            
                              
                          });
      }
    })
  }
  viewUser(selectedUser: User): void {
    this.userService.user = selectedUser;
    this.router.navigateByUrl('/profile')
  }
  openNew(){
    this.showModal();
  }
  showModal(): boolean{
    return this.displayModal = true;;
  }
  hideModal(): boolean{    
    return this.displayModal = false;
  }
  public onAddUser(formData:  NgForm){
    this.user = this.addForm.value;
    this.user.role = this.selectedRole;
    const data = this.userService.createUserFromData(null,this.user,null);
    this.userService.addUser(data).subscribe((response: User) => {
      this.displayModal = this.hideModal();
      
      this.sendNotification(NotificationType.SUCCESS, 'Usuario agregado exitosamente');
      setTimeout(()=>{
        location.reload();
      },1000)
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
