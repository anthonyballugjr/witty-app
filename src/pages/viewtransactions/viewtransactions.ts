import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { CategoryProvider } from '../../providers/category/category';

@IonicPage()
@Component({
  selector: 'page-viewtransactions',
  templateUrl: 'viewtransactions.html',
})
export class ViewtransactionsPage {
  data: any = [];
  transaction = {
    'desc': '',
    'amount': '',
    'wallet': ''
  }
  walletId: any;
  prompt: any;
  loading: any;
  result: any;
  transactionData: any;

  constructor(public categoryProvider: CategoryProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.walletId = this.navParams.get('_id')
    this.getTransactions();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewtransactionsPage');
  }

  getTransactions() {
    this.categoryProvider.getTransactions(this.walletId)
      .then(data => {
        this.data = data;
        console.log(this.data);
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
              this.transaction.wallet = this.data._id;
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
                          this.getTransactions();
                        }, err => {
                          this.loading.dismiss();
                          console.log(err);
                          this.presentToast(err.message);
                        });


                      // this.addTransaction();
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

  // addTransaction() {
  //   this.presentLoading();
  //   this.categoryProvider.addTransaction(this.transaction).then((result) => {
  //     this.loading.dismiss();
  //     this.presentToast('Transaction added to ' + this.data.name);
  //     this.prompt.dismiss();
  //     console.log(result);
  //     this.result = result;
  //     this.data.transactions.push(this.result);
  //     console.log(this.data.transactions);
  //     this.navCtrl.setRoot(HomePage);
  //   }, (err) => {
  //     this.loading.dismiss();
  //     console.log(err);
  //     this.presentToast(err);
  //   });
  // }

}
