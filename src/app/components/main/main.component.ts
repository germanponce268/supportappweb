import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { User } from 'src/app/model/user';
import { NotificationService } from 'src/app/services/notification.service';
import { PhotoService } from 'src/app/services/photo.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public images: any[] = [];
  public users: User[] = [];
  public responsiveOptions!: any[];
  private usersListByUsername!: Map<string, User>;

  constructor(private photoService: PhotoService, private userService: UserService, private notificationService: NotificationService, private router: Router) { }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '1024px',
        numVisible: 4
      },
      {
        breakpoint: '1024px',
        numVisible: 3
      }
    ]
    this.photoService.getImages().subscribe((res:any)=>{
        console.log(res);
        this.images =res.data;
    });
    this.usersListByUsername = new Map<string,User>();
  }

  searchUser(term: string){
    this.userService.getUsers()
                    .subscribe((resp: User[]) =>{
                      for(let i = 0;i < resp.length;i++){
                        this.usersListByUsername.set(resp[i].username, resp[i])
                      }
                      const userFound = this.usersListByUsername.get(term);
                      
                      if(userFound){
                        this.userService.user = userFound;
                        this.router.navigateByUrl('/searched')
                      }else{
                        this.sendNotification(NotificationType.WARNING, 'No existe el usuario buscado');
                      }
                      
                      //this.sendUser.emit(userFound);
                      
                      console.log(userFound);
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
