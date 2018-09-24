import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';

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

  alert: any;
  loading: any;

  constructor(public authProvider: AuthProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private viewCtrl: ViewController) {
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Updating Password...'
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
              }, err => {
                this.loading.dismiss();
                console.log(err);
              });
          });
        });
    }
  }






}
