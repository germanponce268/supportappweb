import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { Route, Router } from '@angular/router';


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
  providers:[MessageService,ConfirmationService]
})
export class UserComponent implements OnInit {

    public users: User[] = [];
    public selectedUser!: User;
    public items: MenuItem[] = [];

    constructor(private userService: UserService) { }

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
            () => this.deleteUser(this.selectedUser)
          }
        ]
    }
  deleteUser(selectedUser: User): void {
    console.log(selectedUser);
  }
  viewUser(selectedUser: User): void {
    console.log(selectedUser);
  }
  openNew(){

  }
}
