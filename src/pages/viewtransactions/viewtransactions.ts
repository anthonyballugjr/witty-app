import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { CategoryProvider } from '../../providers/category/category';

@IonicPage()
@Component({
  selector: 'page-viewtransactions',
  templateUrl: 'viewtransactions.html',
})
export class ViewtransactionsPage {
  data: any;
  transaction = {
    'desc': '',
    'amount': '',
    'walletId': ''
  }
  walletId: any;
  walletName: any;
  prompt: any;
  loading: any;
  result: any;
  transactionData: any;

  constructor(private viewCtrl: ViewController, public categoryProvider: CategoryProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.walletId = this.navParams.get('_id');
    this.walletName = this.navParams.get('walletName');
    this.fetch();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewtransactionsPage');
  }

  fetch() {
    this.screenLoad();
    this.getTransactions();
    this.loading.dismiss();
  }

  screenLoad() {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Fetching wallet transactions'
    });
    this.loading.present();
  }

  getTransactions() {
    this.categoryProvider.getTransactions(this.walletId)
      .then(data => {
        this.data = data;
        console.log('Transactions ', this.data);
      }, err => {
        console.log(err);
      });
  }

  addTransaction() {
    this.prompt = this.alertCtrl.create({
      title: 'New Transaction',
      enableBackdropDismiss: false,
      subTitle: 'Add a new transaction to this wallet',
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
            else {
              this.transaction.desc = data.desc;
              this.transaction.amount = data.amount;
              this.transaction.walletId = this.walletId;
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
                      this.categoryProvider.addTransaction(this.transaction)
                        .then((result) => {
                          this.loading.dismiss();
                          this.presentToast('Transaction added!');
                          this.prompt.dismiss();
                          this.fetch();
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
      content: 'Adding transaction'
    });
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
      dismissOnPageChange: false
    });
    toast.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
