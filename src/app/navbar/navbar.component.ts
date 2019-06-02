import {Component, OnInit} from '@angular/core';
import {CreatorService} from '../_services/creator.service';

declare const alertify: any;
import * as sha256 from '../../../node_modules/sha256/lib/sha256.js';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  newPass;
  oldPass;
  confirmPass;

  constructor(private creatorService: CreatorService) {
  }

  ngOnInit() {
  }

  changePass() {
    if (this.newPass !== this.confirmPass) {
      alertify.error('password and confirm password not match');
      return;
    }
    let passwordOData = {
      newPass: sha256(this.newPass),
      oldPass: sha256(this.oldPass)
    };
    this.creatorService.changePass(passwordOData).subscribe(data => {
      try {
          if(data['data'][0]['message'] === 'Invalid username and password combination'){
            alertify.error('Invalid Password');
          }else{
            alertify.success('Success');
            ($('#changePassModal') as any).modal('hide');
            this.oldPass = '';
            this.newPass = '';
            this.confirmPass = '';
          }
      } catch (e) {
        alertify.error('Error');
      }
    }, err => {
      alertify.error('Error');
    });

  }

}
