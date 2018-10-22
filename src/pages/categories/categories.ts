import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';

import { EditWalletPage } from '../edit-wallet/edit-wallet';
import { AddwalletPage } from '../addwallet/addwallet';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  wallets: any;

  alert: any;
  loading: any;

  constructor(private loadingCtrl: LoadingController, private modalCtrl: ModalController, private alertCtrl: AlertController, public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getWallets();
  }

  showLoader(msg) {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: msg
    });
    this.loading.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  showAlert(title, subTitle) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  getWallets() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        console.log('Wallets', this.wallets);
      });
  }

  addWallet(data) {
    let modal = this.modalCtrl.create(AddwalletPage, { isSavings: data });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        console.log(data);
        this.showLoader('Creating new wallet...');
        this.categoryProvider.addWallet(data)
          .then(result => {
            console.log(result);
            this.loading.dismiss();
            this.showAlert('Success!', 'New ' + data.type + ' wallet created!');
            this.getWallets();
          }, err => {
            this.loading.dismiss();
            console.log(err);
            this.showAlert('Failed', err.error);
          });
      }
    });
  }

  editWallet(wallet) {
    let modal = this.modalCtrl.create(EditWalletPage, { wallet: wallet });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.showLoader('Updating wallet');
        this.categoryProvider.updateWallet(data)
          .then(result => {
            console.log(result);
            this.loading.dismiss();
            this.showAlert('Success!', 'Wallet has been updated.')
            this.getWallets();
          }, err => {
            console.log(err);
            this.showAlert('Failed!', 'Something went wrong, please try again.')
          });
      }
    });
  }

  deleteWallet(id) {
    var userId = id;
    this.alert = this.alertCtrl.create({
      title: 'Delete Wallet',
      subTitle: 'Are you sure you want to delete this wallet?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.showLoader('Deleting wallet');
            this.categoryProvider.deleteWallet(userId).then(result => {
              console.log(result);
              this.loading.dismiss();
              this.showAlert('Success!', 'Wallet removed.')
              this.getWallets();
            }, err => {
              console.log(err);
              this.showAlert(err, err);
            });
          }
        }
      ]
    });
    this.alert.present();
  }

  backToHome() {
    this.navCtrl.setRoot(TabsPage);
  }

}
