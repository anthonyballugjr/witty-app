import { Component } from '@angular/core';
import { NavParams, NavController, ViewController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { BudgetOverviewPage } from '../../pages/budget-overview/budget-overview';

import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'popovermenu',
  templateUrl: 'popovermenu.html'
})
export class PopovermenuComponent {
  toast: any;
  loading: any;
  alert: any;

  menu: any;
  name: any;

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController, public authProvider: AuthProvider, private alertCtrl: AlertController, private viewCtrl: ViewController, private navCtrl: NavController, public navParams: NavParams) {
    console.log('Hello PopovermenuComponent Component');
    this.menu = this.navParams.get('menu');
    this.name = this.navParams.get('name');
    console.log('menu: ', this.menu, 'name: ', this.name)
  }

  showOverview() {
    this.navCtrl.push(BudgetOverviewPage)
    this.viewCtrl.dismiss();
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      dismissOnPageChange: true,
      message: msg,
      showCloseButton: true,
      duration: 2000,
      position: 'middle'
    });
    this.toast.present();
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Updating Nickname...'
    });
    this.loading.present();
  }

  presentAlert(msg) {
    this.alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  editNickname() {
    let prompt = this.alertCtrl.create({
      subTitle: 'Edit Nickname',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: this.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Update',
          handler: (data) => {
            this.presentLoading();
            this.authProvider.updateNickname(data)
              .then(res => {
                this.loading.dismiss();
                console.log(res);
                this.presentAlert('Nickname Successfully Updated!')
                this.viewCtrl.dismiss(data);
              }, err => {
                this.loading.dismiss();
                console.log(err);
                this.presentAlert(err);
                this.viewCtrl.dismiss();
              });
          }
        }
      ]
    });
    prompt.present();
  }

  changePassword(){
    console.log('User will change password');
  }


}
