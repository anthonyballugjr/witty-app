import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  passwordData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  passwordForm: FormGroup;
  alert: any;
  loading: any;

  constructor(public authProvider: AuthProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private viewCtrl: ViewController, public formBldr: FormBuilder) {
    this.passwordForm = formBldr.group({
      oldPassword: ["", Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ])],
      newPassword: ["", Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ])],
      confirmPassword: ["", Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ])]
    })
  }



  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div>
      <div class="loader"><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>Updating password...</p>
      </div>`
    });
    this.loading.present();
  }

  presentAlert(title, subTitle) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  changePassword() {
    if (!this.passwordData.confirmPassword || !this.passwordData.newPassword || !this.passwordData.oldPassword) {
      this.presentAlert('Validation Error', 'Fields must not be empty!');
    }
    else {
      this.presentLoading();
      this.authProvider.changePassword(this.passwordData)
        .then((res) => {
          console.log(res);
          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Success',
            subTitle: 'Password Updated!',
            buttons: ['Ok']
          });
          alert.present();

          alert.onDidDismiss(() => {
            this.loading.dismiss()
              .then(() => {
                this.authProvider.logout();
                this.navCtrl.setRoot(LoginPage);
              }, err => {
                this.loading.dismiss();
                console.log(err);
              });
          });
        }, err => {
          this.loading.dismiss();
          this.presentAlert('Validation Error', err.error);
          console.log(err);
        });
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }





}
