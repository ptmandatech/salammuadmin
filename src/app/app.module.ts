import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { LupaPasswordComponent } from './auth/lupa-password/lupa-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { AdminModule } from './admin/admin.module';
import { MatTimepickerModule } from 'mat-timepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import { ResetComponent } from './auth/reset/reset.component';
import localeId from '@angular/common/locales/id';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeId, 'id');
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LupaPasswordComponent,
    ScrollToBottomDirective,
    ResetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    HttpClientModule,
    AdminModule,
    MatTimepickerModule,
  ],
  providers: [
    DatePipe,
    {provide: LOCALE_ID, useValue: "id-ID" },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
