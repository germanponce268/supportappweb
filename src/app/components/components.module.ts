import { NgModule } from "@angular/core";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./register/register.component";


@NgModule({
    declarations:[LoginComponent, RegisterComponent],
    imports:[PrimeNgModule,FormsModule,ReactiveFormsModule],
    exports:[LoginComponent,RegisterComponent]
})
export class ComponentsModule{};