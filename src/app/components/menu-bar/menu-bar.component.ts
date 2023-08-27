import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, debounceTime } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  private debouncer: Subject<string> = new Subject<string>();
  public search!: FormGroup;
  public title!: string;
  @Input()
  public users!: User[];
  public loguedUser! : User;
  public isAdmin!:boolean;
  public placeholder!: string;
  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter<string>();
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.isAdmin = this.authenticationService.isAdmin;
    this.placeholder = 'Buscar usuario';
    this.title = 'sinEtiqta';
    this.search = new FormGroup({
      searchTerm: new FormControl<string>('')
    });

        this.loguedUser = this.authenticationService.getUserFromLocalCache();
        console.log(this.loguedUser);
    
    
    this.debouncer
              .pipe(
              debounceTime(300)
            )
            .subscribe((value: string) =>{
              this.onDebounce.emit(value);
    })

    
  }

  emitValue(term: string): void{
    this.debouncer.next(term);
    
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigateByUrl('/login')
  }
  
}
