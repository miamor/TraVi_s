import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
//import { RequestDetailPage } from '../request-detail/request-detail';
import { RequestListPage } from '../request-list/request-list';
import { SignupPage } from '../signup/signup';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginParams: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    public navCtrl: NavController, 
    public userData: UserData
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.userData.login(this.loginParams)/*.subscribe(data => {
        console.log(data);
      });*/
      this.navCtrl.setRoot(RequestListPage);
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }
}
