import { NgModule } from "@angular/core";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./register/register.component";
import { CommonModule } from "@angular/common";
import { UserComponent } from "./user/user.component";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
    declarations:[
        LoginComponent,
        RegisterComponent,
        UserComponent,
        MenuBarComponent,
        ProfileComponent
        ],
    imports:[
        PrimeNgModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule
    ],
    exports:[
        LoginComponent,
        RegisterComponent,
        UserComponent,
        MenuBarComponent
        ]
})
export class ComponentsModule{};