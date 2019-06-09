import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {SettingComponent} from './setting/setting.component';
import {UserSettingComponent} from './user-setting/user-setting.component';
import {adminGuard, AuthGuard, powerUserGuard} from './_services/auth.guard';

const routes: Routes = [

  { path: '', component: LoginComponent},
  { path: 'home',  component:HomeComponent , canActivate:[AuthGuard]},
  { path: 'setting',  component:SettingComponent,canActivate:[powerUserGuard]},
  { path: 'userSetting',  component:UserSettingComponent,canActivate:[adminGuard]},
  { path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
