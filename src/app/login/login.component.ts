import {Component, OnInit} from '@angular/core';
import * as sha256 from '../../../node_modules/sha256/lib/sha256.js';
import {SelectorService} from '../_services/selector.service';
import {Router} from '@angular/router';

declare const $: any;
declare const alertify: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username;
  password;

  constructor(private selectorService: SelectorService, private router: Router) {
  }

  ngOnInit() {
    //for them

    (function ($) {
      'use strict';


      /*==================================================================
      [ Focus input ]*/
      $('.input100').each(function () {
        $(this).on('blur', function () {
          if ($(this).val().trim() != '') {
            $(this).addClass('has-val');
          }
          else {
            $(this).removeClass('has-val');
          }
        });
      });


      /*==================================================================
      [ Validate ]*/
      var input = $('.validate-input .input100');

      $('.validate-form').on('submit', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
          if (validate(input[i]) == false) {
            showValidate(input[i]);
            check = false;
          }
        }

        return check;
      });


      $('.validate-form .input100').each(function () {
        $(this).focus(function () {
          hideValidate(this);
        });
      });

      function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
          if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
          }
        }
        else {
          if ($(input).val().trim() == '') {
            return false;
          }
        }
      }

      function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
      }

      function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
      }

      /*==================================================================
      [ Show pass ]*/
      var showPass = 0;
      $('.btn-show-pass').on('click', function () {
        if (showPass == 0) {
          $(this).next('input').attr('type', 'text');
          $(this).addClass('active');
          showPass = 1;
        }
        else {
          $(this).next('input').attr('type', 'password');
          $(this).removeClass('active');
          showPass = 0;
        }

      });


    })($);
    //end
  }


  login() {
    this.selectorService.login(this.username, sha256(this.password)).subscribe(data => {
      try {
        if (data['data']['token']) {
          localStorage.setItem('token', data['data']['token']);
          switch (data['data']['user']) {
            case 1:
              localStorage.setItem('type', 'U54ji');
              break;
            case 2:
              localStorage.setItem('type', 'U77lk');
              break;
            case 3:
              localStorage.setItem('type', 'U15nb');
              break;
          }
          this.router.navigate(['home']);
          return;
        }
        if (data['data'][0]['message'] === 'Invalid  username or password') {
          alertify.error('Invalid  username and password');
          return;
        }
        else {
          alertify.error('deActive');
        }
      } catch (e) {
        alertify.error('An error has occurred');
      }
    }, err => {

    });
  }

}
