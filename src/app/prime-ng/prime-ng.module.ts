import { NgModule } from "@angular/core";
import {InputTextModule} from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from "@angular/platform-browser";
import {TableModule} from 'primeng/table';
import {ContextMenuModule} from 'primeng/contextmenu';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';

@NgModule({
    declarations:[],
    imports: [
        InputTextModule,
        ButtonModule,
        BrowserModule,
        TableModule,
        ContextMenuModule,
        ToolbarModule,
        FileUploadModule
    ],
    exports: [
        InputTextModule,
        ButtonModule,
        BrowserModule,
        TableModule,
        ContextMenuModule,
        ToolbarModule,
        FileUploadModule
    ]

})
export class PrimeNgModule{}