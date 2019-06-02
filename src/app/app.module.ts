import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {LoaderInterceptor} from './_services/httpinterceptor.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './_services/auth.guard';
import {Select2Module} from 'ng2-select2';
import {FormsModule} from '@angular/forms';
import { SettingComponent } from './setting/setting.component';
import {FilterPipe} from './pipes/filter.pipe';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DataTableModule} from 'angular-6-datatable';
import { NavbarComponent } from './navbar/navbar.component';
import { UserSettingComponent } from './user-setting/user-setting.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SettingComponent,
    FilterPipe,
    NavbarComponent,
    UserSettingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    Select2Module,
    HttpClientModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    DataTableModule

  ],
  providers: [
    AuthGuard,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
