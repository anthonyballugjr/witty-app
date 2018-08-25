import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';

import { CategoryProvider } from '../../providers/category/category';

/**
 * Generated class for the ViewtransactionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  prompt: any;
  loading: any;
  result: any;

  constructor(private zone: NgZone, public categoryProvider: CategoryProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get('data');
    console.log(this.data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewtransactionsPage');
    this.data = this.navParams.get('data');
    console.log(this.data.transactions)
  }

  ionViewDidEnter() {

  }

  showAlert() {
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
              this.transaction.wallet = this.data.id;
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
                      this.addTransaction();
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

  addTransaction() {
    this.presentLoading();
    this.categoryProvider.addTransaction(this.transaction).then((result) => {
      this.loading.dismiss();
      this.presentToast('Transaction added to ' + this.data.name);
      this.prompt.dismiss();
      console.log(result);
      this.result = result;
      this.zone.run(()=>{
        this.data.transactions.push(this.result);
      })
      console.log(this.data.transactions);
    }, (err) => {
      this.loading.dismiss();
      console.log(err);
      this.presentToast(err);
    });
  }

}
