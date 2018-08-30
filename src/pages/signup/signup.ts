import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  loading: any;
  errMessage: any;
  registerData = {
    "user": {
      "email": "",
      "password": "",
      "name": ""
    }
  }

  constructor(private alertCtrl: AlertController, public formBldr: FormBuilder, public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
  }

  private signUpForm = this.formBldr.group({
    email: ["", Validators.required],
    password: ["", Validators.required],
    nickname: ["", Validators.required]
  });

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  register() {
    this.showLoader();
    this.authProvider.register(this.registerData).then((result) => {
      this.loading.dismiss();
      this.presentToast('Successfull Registration!')
      this.navCtrl.pop();
      console.log(this.registerData);
      console.log(result);
    }, (err) => {
      this.loading.dismiss();
      if (err.status === 400) {
        this.errMessage = 'The specified email address is already in use'
      }
      this.presentToast(this.errMessage);
      console.log(this.registerData);
      console.log(err)
    });

  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'bottom',
      dismissOnPageChange: false
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}
