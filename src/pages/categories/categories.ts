import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { SavingsProvider } from '../../providers/savings/savings';

import { EditWalletPage } from '../edit-wallet/edit-wallet';
import { AddwalletPage } from '../addwallet/addwallet';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  expenseWallets: any;
  savingsWallets: any;
  type: any;

  alert: any;
  loading: any;

  constructor(private loadingCtrl: LoadingController, private modalCtrl: ModalController, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public savingsProvider: SavingsProvider, public expensesProvider: ExpensesProvider) {
    this.getExpenseWallets();
    this.getSavingsWallet();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  showLoader(msg) {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: msg
    });
    this.loading.present();
  }

  onSwipe(itemSliding, walletId) {
    this.deleteSavings(walletId);
    itemSliding.close();
  }

  ondrag(item, id) {
    let percent = item.getSlidingPercent();
    console.log('percent', percent);
    console.log('abs', Math.abs(percent));

    if (percent = 1) {
      console.log(percent);
      // positive
      // this.deleteSavings(id);
      console.log('right side');
    } else {
      // negative
      console.log('left side');
    }
    if (Math.abs(percent) > 60) {
      console.log('overscroll');
    }
  }


  showAlert(title, subTitle) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  getExpenseWallets() {
    this.expensesProvider.getWallets(localStorage.period)
      .then(data => {
        this.expenseWallets = data;
        console.log('Expense Wallets', this.expenseWallets);
      });
  }

  getSavingsWallet() {
    this.savingsProvider.getWallets()
      .then(data => {
        this.savingsWallets = data;
        console.log('Savings wallets', this.savingsWallets);
      });
  }

  addWallet(data) {
    let modal = this.modalCtrl.create(AddwalletPage, { isSavings: data });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        console.log(data);
        this.showLoader('Creating new wallet...');
        this.expensesProvider.addWallet(data)
          .then(result => {
            console.log(result);
            this.loading.dismiss();
            this.showAlert('Success!', 'New ' + data.type + ' wallet created!');
            this.getExpenseWallets();
          }, err => {
            this.loading.dismiss();
            console.log(err);
            this.showAlert('Failed', err.error);
          });
      }
    });
  }

  editExpense(wallet) {
    let modal = this.modalCtrl.create(EditWalletPage, { wallet: wallet, type: 'expense' });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.showLoader('Updating wallet');
        this.expensesProvider.updateWallet(data)
          .then(result => {
            console.log(result);
            this.loading.dismiss();
            this.showAlert('Success!', 'Wallet has been updated.')
            this.getExpenseWallets();
          }, err => {
            console.log(err);
            this.loading.dismiss();
            this.showAlert('Failed!', 'Something went wrong, please try again.')
          });
      }
    });
  }

  editSavings(wallet) {
    let modal = this.modalCtrl.create(EditWalletPage, { wallet: wallet, type: 'savings' });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.showLoader('Updating wallet');
        this.savingsProvider.updateWallet(data)
          .then(result => {
            console.log(result);
            this.loading.dismiss();
            this.showAlert('Success!', 'Wallet has been updated.')
            this.getSavingsWallet();
          }, err => {
            console.log(err);
            this.loading.dismiss();
            this.showAlert('Failed!', 'Something went wrong, please try again.')
          });
      }
    });
  }

  deleteExpense(id) {
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
            this.expensesProvider.deleteWallet(userId).then(result => {
              console.log(result);
              this.loading.dismiss();
              this.showAlert('Success!', 'Wallet removed.')
              this.getExpenseWallets();
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

  deleteSavings(id) {
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
            this.savingsProvider.deleteWallet(userId).then(result => {
              console.log(result);
              this.loading.dismiss();
              this.showAlert('Success!', 'Wallet removed.')
              this.getSavingsWallet();
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

}
