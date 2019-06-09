import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import Global from '../global.service';
import * as sha256 from '../../../node_modules/sha256/lib/sha256.js';

@Injectable({
  providedIn: 'root'
})
export class CreatorService {

  constructor(private http: HttpClient, private global: Global) {
  }

  login() {

  }

  setOneLineSchedule(siteModel) {
    return this.http.post(this.global.url + 'api/scrap/setScheduleOneLine', siteModel);
  }

  insertPortToPortForSite(portToPortModel) {
    return this.http.post(this.global.url + 'api/scrap/savePortToPort', portToPortModel);
  }

  registerUser(userOData) {
    let colone = JSON.parse(JSON.stringify(userOData));
    ;
    colone['password'] = sha256(colone['password']);
    return this.http.post(this.global.url + 'api/user/register', colone);
  }

  savePortToPort(PortToPort) {
    return this.http.post(this.global.url + 'api/scrap/savePortToPort', PortToPort);
  }

  saveSetting(settingOData) {
    return this.http.post(this.global.url + 'api/scrap/saveSetting', settingOData);
  }

  changePass(changePassOData) {
    return this.http.post(this.global.url + 'api/user/changePassword', changePassOData);
  }

  saveSysyemEmail(settingOData) {
    return this.http.post(this.global.url + 'api/user/saveSystemEmail', settingOData);
  }

  loadSystemEmail(emailId) {
    let data = {
      emailId: emailId
    };
    return this.http.post(this.global.url + 'api/user/loadSystemEmails', data);
  }

  addEmail(masterId, email) {
    let emailOData = {
      email: email,
      masterId: masterId
    };
    return this.http.post(this.global.url + 'api/user/addEmail', emailOData);
  }

  saveEmailSetting(masterId, saveTime, time) {
    let emailOData = {
      saveTime: saveTime,
      time: time,
      masterId: masterId
    };
    return this.http.post(this.global.url + 'api/user/saveEmailSetting', emailOData);
  }

  deleteEmail(emailId) {
    let emailOData = {
      emalId: emailId
    };
    return this.http.post(this.global.url + 'api/user/deleteEmail', emailOData);
  }

  deletePortToPort(id) {
    let data = {
      PortToPortId: id
    };
    return this.http.post(this.global.url + 'api/scrap/deletePortToPort', data);
  }


}
