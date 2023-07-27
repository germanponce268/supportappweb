import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
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
  constructor(
    private userService: UserService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private router : Router,
    private notificationService: NotificationService
              ) { }

  ngOnInit(): void {
    this.user = this.userService.user
    this.image = this.user.profileImageUrl;
    this.primengConfig.ripple = true;
  }

  getFullName(): string{
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  delete():void{
    console.log('Delete')
    this.confirmationService.confirm({
        message: 'Estas seguro de borrar al usuario?',
        header: 'Confirmacion',
        icon: 'pi pi-exclamation-triangle',
      accept:() => this.userService.deleteUser(this.user.id)
                                .subscribe(resp => {
                                  console.log('se borro a' , this.user.id);
                                  this.sendNotification(NotificationType.SUCCESS, 'Se ha borrado al usuario con exito!');
                                  this.router.navigateByUrl('user/management');
                                }),
      reject: () => console.log('Can')
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
