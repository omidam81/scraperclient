import {Injectable} from '@angular/core';
import Global from '../global.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SelectorService {

  constructor(private global: Global, private http: HttpClient) {
  }

  login(username, password) {
    let data = {
      username: username,
      password: password
    };
    return this.http.post(this.global.url + 'api/user/login', data);
  }

  loadPorts(portId) {
    let data = {
      portId: portId
    };
    return this.http.post(this.global.url + 'api/scrap/loadPoints', data);
  }

  loadSites(siteId) {
    let data = {
      siteId: siteId
    };
    return this.http.post(this.global.url + 'api/scrap/loadSites', data);
  }

  loadAllUsers(userType, userId) {
    let data = {
      userId: userId,
      userType: userType
    };
    return this.http.post(this.global.url + 'api/user/loadUsers', data);
  }

  loadSetting(siteId) {
    let data = {
      siteId: siteId
    };
    return this.http.post(this.global.url + 'api/scrap/loadSetting', data);
  }

  loadPortToPort(siteId) {
    let data = {
      siteId: siteId
    };
    return this.http.post(this.global.url + 'api/scrap/loadPortToPort', data);
  }

  loadEmailList(emailId) {
    let data = {
      emailId: emailId
    };
    return this.http.post(this.global.url + 'api/user/loadAllemails', data);
  }

  loadMasterEmailSetting(masterId = -1) {
    let masterOData = {
      masterId: masterId
    };
    return this.http.post(this.global.url + 'api/user/loadEmailSetting', masterOData);
  }

  loadScrapReport(ScrapOData) {
    return this.http.post(this.global.url + 'api/scrap/scrapReport', ScrapOData);
  }
  getLastPorts(){
    return this.http.get(this.global.url + 'api/scrap/getNewPort');
  }
  getLastRouts(){
    return this.http.get(this.global.url + 'api/scrap/getNewRout');
  }
}
