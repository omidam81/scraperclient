import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scraping';
  showheather;
  showfooter;
  constructor(private router:Router){
    router.events.subscribe(val => {
      this.showheather =
        this.router.url === '/'
          ? false
          : true;
      this.showfooter = this.router.url === '/'
        ? false
        : true;
    });
  }

}
