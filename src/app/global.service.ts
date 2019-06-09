import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export default class Global {

  constructor() { }
  url = 'http://localhost:411/';
  // url = 'http://192.168.1.29:411/';
}
