import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, debounceTime } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  private debouncer: Subject<string> = new Subject<string>();
  public search!: FormGroup;
  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Usuarios');
  public titleAction$: Observable<string> = this.titleSubject.asObservable();
  @Input()
  public users!: User[];
  
  public placeholder!: string;
  @Output()
  public onDebounce: EventEmitter<string> = new EventEmitter<string>();
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    
    this.placeholder = 'Buscar por usuario';

    this.search = new FormGroup({
      searchTerm: new FormControl<string>('') 
    })

    this.debouncer
              .pipe(
              debounceTime(300)
            )
            .subscribe((value: string) =>{
              this.onDebounce.emit(value);
    })

    
  }
  public changeTitle(title: string): void{
    this.titleSubject.next(title);
   
  }

  emitValue(term: string): void{
    this.debouncer.next(term);
    
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigateByUrl('/login')
  }
  
}
