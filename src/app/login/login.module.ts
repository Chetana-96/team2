import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

//Module
import { GrowlModule } from 'primeng/growl';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        LoginRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        GrowlModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}
