import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user! : User;
  public image! : string;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.user
    this.image = this.user.profileImageUrl;
  }

  getFullName(): string{
    return `${this.user.firstName} ${this.user.lastName}`;
  }
}
