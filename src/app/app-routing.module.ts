import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {SettingComponent} from './setting/setting.component';
import {UserSettingComponent} from './user-setting/user-setting.component';

const routes: Routes = [

  { path: '', component: LoginComponent},
  { path: 'home',  component:HomeComponent},
  { path: 'setting',  component:SettingComponent},
  { path: 'userSetting',  component:UserSettingComponent},
  { path: '**', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
