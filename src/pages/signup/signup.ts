import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  loading: any;
  errMessage: any;
  sForm: FormGroup;

  registerData = {
    "user": {
      "email": "",
      "password": "",
      "name": ""
    }
  }

  constructor(private viewCtrl: ViewController, public formBldr: FormBuilder, public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
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
      this.viewCtrl.dismiss();
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
      duration: 3000,
      position: 'top',
      dismissOnPageChange: false,
      showCloseButton: true,
      closeButtonText: 'Dismiss'
    });
    toast.present();
  }
}
