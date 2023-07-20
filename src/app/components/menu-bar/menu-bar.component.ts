import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  private titleSubject = new BehaviorSubject<string>('Usuarios');
  public titleAction$ = this.titleSubject.asObservable();
  constructor() { }

  ngOnInit(): void {
  }
  public changeTitle(title: string): void{
    this.titleSubject.next(title);
  }
}
