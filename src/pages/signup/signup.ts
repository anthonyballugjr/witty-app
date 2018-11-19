import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController, MenuController, ModalController } from 'ionic-angular';
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
  message: any;

  registerData = {
    "user": {
      "email": "",
      "password": "",
      "name": ""
    }
  }

  cBox = false;

  constructor(private viewCtrl: ViewController, public formBldr: FormBuilder, public http: HttpClient, public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private menuCtrl: MenuController, public modalCtrl: ModalController) {
    console.log(this.cBox);
  }

  private signUpForm = this.formBldr.group({
    email: ["", Validators.required],
    password: ["", Validators.compose([
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(6)
    ])],
    nickname: ["", Validators.required],
    terms: ["", Validators.requiredTrue]
  });

  check() {
    console.log(this.cBox);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeEnable(false);
  }

  register() {
    this.showLoader();
    this.authProvider.register(this.registerData).then((result) => {
      this.message = result
      this.loading.dismiss();
      this.presentToast('Successfull Registration! ' + this.message.message);
      this.viewCtrl.dismiss();
      console.log(result);
    }, (err) => {
      this.loading.dismiss();
      if (err.status === 400) {
        this.errMessage = 'The specified email address is already in use'
      }
      else {
        this.errMessage = err.error;
      }
      this.presentToast(this.errMessage);
      console.log(this.registerData);
      console.log(err)
    });

  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div>
      <div><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>Creating your account...</p>
      </div>`
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

  showDataPolicy() {
    var dataPolicy = this.modalCtrl.create('DatapolicyPage');
    dataPolicy.present();
  }
}
