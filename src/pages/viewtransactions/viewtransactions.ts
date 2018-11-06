import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { TransactionsProvider } from '../../providers/transactions/transactions';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-viewtransactions',
  templateUrl: 'viewtransactions.html',
})
export class ViewtransactionsPage {
  transactions: any;
  transaction = {
    'desc': '',
    'amount': '',
    'walletId': ''
  }
  wallet: any;
  prompt: any;
  loading: any;
  result: any;
  totalTransactions: Number = 0;

  constructor(private viewCtrl: ViewController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public transactionsProvider: TransactionsProvider) {
    this.wallet = this.navParams.get('wallet');
    this.getTransactions();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewtransactionsPage');
    console.log('WalletData', this.wallet);
  }

  getTransactions() {
    this.transactionsProvider.getTransactions(this.wallet._id)
      .then(data => {
        this.transactions = data;
        var a = 0;
        for (let x of this.transactions) {
          a += x.amount;
        }
        this.totalTransactions = a;
        console.log('Total Expenses', this.totalTransactions);
        console.log('Transactions ', this.transactions);
      }, err => {
        console.log(err);
      });
  }

  addTransaction() {
    this.prompt = this.alertCtrl.create({
      title: 'New Transaction',
      enableBackdropDismiss: false,
      subTitle: 'Add new transaction to this wallet',
      inputs: [
        {
          name: 'desc',
          label: 'Description',
          type: 'text',
          placeholder: 'Enter Description'
        },
        {
          label: 'Amount',
          type: 'number',
          name: 'amount',
          placeholder: 'Enter amount'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'Add',
          handler: (data) => {
            if (data.desc === '' || data.amount === '') {
              this.presentToast('Fields must not be empty');
              return false;
            }
            else if ((data.amount + this.totalTransactions) > this.wallet.amount || data.amount > this.totalTransactions) {
              let warning = this.alertCtrl.create({
                title: 'Warning!',
                subTitle: 'Adding this transaction will lead to overspending on this wallet, are you sure you want to continue?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Yes, I Understand',
                    handler: () => {
                      this.transaction.desc = data.desc;
                      this.transaction.amount = data.amount;
                      this.transaction.walletId = this.wallet._id;

                      this.presentLoading();
                      this.transactionsProvider.addTransaction(this.transaction)
                        .then((result) => {
                          this.loading.dismiss();
                          this.presentToast('Transaction added!');
                          this.prompt.dismiss();
                          this.getTransactions();
                        }, err => {
                          this.loading.dismiss();
                          console.log(err);
                          this.presentToast(err.message);
                        });
                    }
                  }
                ]
              });
              warning.present();
              return true;
            }
            else {
              this.transaction.desc = data.desc;
              this.transaction.amount = data.amount;
              this.transaction.walletId = this.wallet._id;
              let confirm = this.alertCtrl.create({
                subTitle: 'Add transaction?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                  },
                  {
                    text: 'Agree',
                    handler: () => {
                      this.presentLoading();
                      this.transactionsProvider.addTransaction(this.transaction)
                        .then((result) => {
                          this.loading.dismiss();
                          this.presentToast('Transaction added!');
                          this.prompt.dismiss();
                          this.getTransactions();
                        }, err => {
                          this.loading.dismiss();
                          console.log(err);
                          this.presentToast(err.message);
                        });
                    }
                  }
                ]
              });
              confirm.present();
              return false;
            }
          }
        }
      ]
    });
    this.prompt.present();
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Adding transaction...'
    });
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
      dismissOnPageChange: false,
      closeButtonText: 'Dismiss',
      showCloseButton: true
    });
    toast.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
