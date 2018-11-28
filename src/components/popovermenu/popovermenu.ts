import { Component } from '@angular/core';
import { NavParams, NavController, ViewController, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { BudgetOverviewPage } from '../../pages/budget-overview/budget-overview';
import { AuthProvider } from '../../providers/auth/auth';
import { ChangePasswordPage } from '../../pages/change-password/change-password';
import { PredictionPage } from '../../pages/prediction/prediction';

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
  names: any = [];
  amounts: any = [];

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController, public authProvider: AuthProvider, private alertCtrl: AlertController, private viewCtrl: ViewController, private navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) {
    this.menu = this.navParams.get('menu');
    this.name = this.navParams.get('name');
    this.names = this.navParams.get('names');
    this.amounts = this.navParams.get('amounts');
    console.log('menu: ', this.menu, 'name: ', this.name, 'names', this.names, 'amounts', this.amounts);
  }

  showOverview() {
    let modal = this.modalCtrl.create(BudgetOverviewPage, { profile: true });
    modal.present();
    this.viewCtrl.dismiss();
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      dismissOnPageChange: true,
      message: msg,
      showCloseButton: true,
      duration: 2000,
      position: 'top',
      closeButtonText: 'Dismiss'
    });
    this.toast.present();
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div>
      <div><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>Updating nickname...</p>
      </div>`
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
      enableBackdropDismiss: false,
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
            this.viewCtrl.dismiss();
          }
        },
        {
          text: 'Update',
          handler: (data) => {
            if (!data.name) {
              this.presentToast('Nickname cannot be empty');
              return false;
            }
            else {
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
        }
      ]
    });
    prompt.present();
  }

  changePassword() {
    let modal = this.modalCtrl.create(ChangePasswordPage);
    modal.present();
    this.viewCtrl.dismiss();
  }

  showPrediction() {
    this.navCtrl.push(PredictionPage);
    this.viewCtrl.dismiss();
  }

}
