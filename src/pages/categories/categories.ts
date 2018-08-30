import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';

import { EditWalletPage } from '../edit-wallet/edit-wallet';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  wallets: any;
  alert: any;

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getWallets();
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
      });
  }
  editWallet(wallet) {
    let modal = this.modalCtrl.create(EditWalletPage, { wallet: wallet });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.categoryProvider.updateWallet(data)
          .then(result => {
            setTimeout(() => {
              console.log(result);
              this.showAlert('Success!', 'Wallet has been updated.')
              this.getWallets();
            });
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
            this.categoryProvider.deleteWallet(userId).then(result => {
              setTimeout(() => {
                console.log(result);
                this.showAlert('Success!', 'Wallet removed.')
                this.getWallets();
              }, err => {
                console.log(err);
                this.showAlert(err, err);
              });
            });
          }
        }
      ]
    });
    this.alert.present();
  }

}
