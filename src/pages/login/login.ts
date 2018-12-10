import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, MenuController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { HttpClient } from '@angular/common/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth'
import { NetworkProvider } from '../../providers/network/network';
import { Events } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';

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
  userEmail = localStorage.email;

  alert: any;
  toast: any;
  attempt: number = 0;

  constructor(private toastCtrl: ToastController, public authProvider: AuthProvider, private formBldr: FormBuilder, public http: HttpClient, private facebook: Facebook, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private menuCtrl: MenuController, private events: Events, private network: NetworkProvider) {
    this.loginForm = this.formBldr.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });

    this.attempt = 0;
    this.events.subscribe('attempt:changed', attempt => {
      if (attempt >= 3) {
        this.attemptAlert();
      }
    })
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
      spinner: 'hide',
      content: `<div>
      <div class="loader"><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>${content}</p>
      </div>`,
    });
    this.loading.present();
  }

  attemptAlert() {
    let alert = this.alertCtrl.create({
      title: 'Hey there!',
      subTitle: 'Are you a new user?, Witty suggets that you register an account to use the application.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'I already have an account',
          handler: () => {
            this.presentToast("If you forgot your password, we can assist you by selecting the 'Forgot Password' option");
          }
        },
        {
          text: 'Yes, I would like to register',
          handler: () => {
            this.navCtrl.push(SignupPage);
            this.attempt = 0;
          }
        }
      ]
    });
    alert.present();
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top',
      dismissOnPageChange: false,
      showCloseButton: true,
      closeButtonText: 'Dismiss'
    });
    this.toast.present();
  }

  register() {
    this.navCtrl.push(SignupPage);
  }

  login() {
    if (this.network.checkNetwork()) {
      this.showLoader('Authenticating...');
      this.authProvider.login(this.loginData).then((result) => {
        console.log(result);
        this.loading.dismiss();
        this.navCtrl.setRoot(TabsPage);
        this.presentToast(`Hello ${localStorage.nickname}!`);
      }, (err) => {
        this.loading.dismiss();
        this.presentToast(err.error);
        this.attempt++;
        this.events.publish('attempt:changed', this.attempt);
        console.log(this.attempt);
        console.log(err);
      });
    } else {
      this.presentToast('Network Error, Please check your connection');
    }
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
            console.log(fbData);

            // this.navCtrl.setRoot(TabsPage, { userData: this.userDataFB });
          });
      });
  }

  requestReset() {
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
            this.showLoader('Submitting request...');
            if (!data.email) {
              this.loading.dismiss();
              console.log('No email provided')
              this.presentToast('Please provide a valid Email');
              return false;
            }
            else {
              if (this.network.checkNetwork()) {
                console.log(data);
                this.authProvider.requestReset(data.email)
                  .then(
                    response => {
                      this.loading.dismiss();
                      console.log(response);
                      this.presentToast(response);
                    }, err => {
                      this.loading.dismiss();
                      this.presentToast(err);
                      console.log(err);
                    });
              } else {
                this.presentToast('Network Error, Please check your connection');
              }
            }
          }
        }
      ]
    });
    this.alert.present();
  }

}
