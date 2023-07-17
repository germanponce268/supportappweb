import { NgModule } from "@angular/core";
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';

@NgModule({
    declarations:[],
    imports: [
        InputTextModule,
        PasswordModule
    ],
    exports: [
        InputTextModule,
        PasswordModule
    ]
})
export class PrimeNgModule{}