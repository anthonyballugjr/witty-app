import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, MenuController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';

import { HttpClient } from '@angular/common/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
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

  alert: any;

  constructor(private toastCtrl: ToastController, public authProvider: AuthProvider, private formBldr: FormBuilder, public http: HttpClient, private facebook: Facebook, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private menuCtrl: MenuController) {
    this.loginForm = this.formBldr.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('Welcome to Witty Wallet');
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  showLoader(content) {
    this.loading = this.loadingCtrl.create({
      content: content,
    });
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      dismissOnPageChange: false,
      showCloseButton: true
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
    this.showLoader('Authenticating...');
    this.authProvider.login(this.loginData).then((result) => {
      console.log(result);
      this.loading.dismiss();
      this.navCtrl.setRoot(TabsPage);
      this.presentToast('Hello, ' + localStorage.nickname);
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err.error);
      console.log(err);
    });
  }

  loginWithFB() {
    this.facebook.login(['email', 'public_profile'])
      .then((res: FacebookLoginResponse) => {
        this.facebook.api('me?fields=id,name,email,first_name,picture.width(100).height(100).as(picture)', [])
          .then(profile => {
            this.userDataFB = { email: profile['email'], firstName: profile['first_name'], picture: profile['picture']['data']['url'], username: profile['name'] }
            let fbData = {
              user: {
                'email': profile['email']
              }
            }
            console.log(this.userDataFB);

            // this.navCtrl.setRoot(TabsPage, { userData: this.userDataFB });
          });
      });
  }

  forgotPassword() {
    this.alert = this.alertCtrl.create({
      title: 'Forgot Password',
      subTitle: '<ion-icon name="baseball"></ion-icon> Please provide your registered email address',
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'email',
          placeholder: 'user@email.com',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled resetting password');
          }
        },
        {
          text: 'Submit',
          handler: (data) => {
            this.showLoader('Authenticating...');
            if (!data.email) {
              this.loading.dismiss();
              console.log('No email provided')
              this.presentToast('Please provide a valid Email');
              return false;
            }
            else {
              console.log(data);
              this.loading.dismiss();
              this.presentToast('A new password has been sent to your email')
            }
          }
        }
      ]
    });
    this.alert.present();
  }

}
