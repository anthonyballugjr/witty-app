import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';

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

  errMessage: any;
  loading: any;
  data: any;
  userDataFB: any;
  loginData = {
    "user": {
      "email": "",
      "password": ""
    }
  }
  message: any;
  userData: any;

  constructor(private toastCtrl: ToastController, public authProvider: AuthProvider, private formBldr: FormBuilder, public http: HttpClient, private facebook: Facebook, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

  private loginForm = this.formBldr.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  });

  ionViewDidLoad() {
    //this.showLoader();
    //check authentication

  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...',
    });
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: false
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  register() {
    this.navCtrl.push(SignupPage);
  }

  login() {
    this.showLoader();
    this.authProvider.login(this.loginData).then((result) => {
      this.loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
      this.presentToast('Hello, ' + localStorage.nickname);
    }, (err) => {
      this.loading.dismiss();
      if (err.status === 401) {
        this.errMessage = 'User not found';
      }
      this.presentToast(this.errMessage);
      console.log(err);
    });
  }

  loginWithFB(userData) {
    this.facebook.login(['email', 'public_profile'])
      .then((res: FacebookLoginResponse) => {
        this.facebook.api('me?fields=id,name,email,first_name,picture.width(100).height(100).as(picture)', [])
          .then(profile => {
            this.userDataFB = { email: profile['email'], firstName: profile['first_name'], picture: profile['picture']['data']['url'], username: profile['name'] }

            console.log(this.userDataFB);
            this.navCtrl.setRoot(TabsPage, { userData: this.userDataFB });
          });
      });
  }

}
