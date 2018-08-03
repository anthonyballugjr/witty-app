import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { HomePage } from '../home/home';
import { HttpClient } from '@angular/common/http';
import { Validators, FormBuilder } from '@angular/forms';


import { AuthProvider } from '../../providers/auth/auth'

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userDataFB: any;
  loginData = {
    'username': '',
    'password': ''
  };
  message: any;
  userData: any;

  constructor(private toastCtrl: ToastController, public authProvider: AuthProvider, private formBldr: FormBuilder, public http: HttpClient, private facebook: Facebook, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

  private loginForm = this.formBldr.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
  });

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  error() {
    let error = this.toastCtrl.create({
      message: this.message,
      duration: 1500,
      position: 'middle'
    });
    error.onDidDismiss(() => {
      console.log('error dismissed');
    });
    error.present();
  }

  // login(){
  //   this.navCtrl.setRoot(HomePage);
  // }

  login() {
    this.authProvider.login(this.loginData).then((result) => {
      console.log(result);
      this.userData = result;
      this.navCtrl.setRoot(HomePage);
    }, err => {
      console.log(err);
      this.message = err;
      this.error();
    });
  }

  loginWithFB(userData) {
    this.facebook.login(['email', 'public_profile'])
      .then((res: FacebookLoginResponse) => {
        this.facebook.api('me?fields=id,name,email,first_name,picture.width(100).height(100).as(picture)', [])
          .then(profile => {
            this.userDataFB = { email: profile['email'], firstName: profile['first_name'], picture: profile['picture']['data']['url'], username: profile['name'] }
            console.log(this.userDataFB);
            this.navCtrl.setRoot(HomePage, { userData: userData });
          });
      });
  }

}
