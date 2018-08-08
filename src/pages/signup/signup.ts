import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';

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
  registerData = {
    'username': '',
    'password': ''
  }

  constructor(private alertCtrl: AlertController, private formBldr: FormBuilder, public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
  }

  private signUpForm = this.formBldr.group({
    username: ["", Validators.required],
    password: ["", Validators.required]
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
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err.message);
      console.log(this.registerData);
      console.log(err)
    });

  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
    this.loading.present();
    setTimeout(()=>{
      this.loading.dismiss();
    }, 2000);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}
