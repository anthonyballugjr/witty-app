import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { DepositsProvider } from '../../providers/deposits/deposits';


@IonicPage()
@Component({
  selector: 'page-view-deposits',
  templateUrl: 'view-deposits.html',
})
export class ViewDepositsPage {
  deposits: any;
  deposit = {
    amount: '',
    walletId: '',
    period: localStorage.period
  }

  walletId: any;
  walletName: any;

  prompt: any;
  loading: any;
  result: any;
  depositData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private loadCtrl: LoadingController, private toastCtrl: ToastController, public depositsProvider: DepositsProvider) {
    this.walletId = this.navParams.get('_id');
    this.walletName = this.navParams.get('walletName');
    this.getDeposits();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewDepositsPage');
  }

  presentLoad(content) {
    this.loading = this.loadCtrl.create({
      spinner: 'bubbles',
      content: content
    });
    this.loading.present();
  }

  presentToast(msg){
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

  getDeposits() {
    this.presentLoad('Fetching deposits...');
    this.depositsProvider.getDeposits(this.walletId)
      .then(data => {
        this.deposits = data;
        console.log('Deposits', this.deposits);
        this.loading.dismiss();
      }, err => {
        this.loading.dismiss();
        console.log(err);
      });
  }

  addDeposit(){
    let alert = this.alertCtrl.create({
      title: 'New Deposit',
      enableBackdropDismiss: false,
      subTitle: 'Add new deposit to this saving wallet',
      inputs: [
        {
          name: 'amount',
          label: 'Amount',
          type: 'number',
          placeholder: 'Enter amount'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: (data) =>{
            if(data.amount === ''){
              this.presentToast('Amount must not be empty');
              return false;
            }
            else{
              this.deposit.walletId = this.walletId;
              this.deposit.period = localStorage.period;
              this.deposit.amount = data.amount;
              let confirm = this.alertCtrl.create({
                subTitle: 'Add deposit?',
                buttons: [
                  {
                    text: 'Cancel',
                    role:'cancel'
                  },
                  {
                    text: 'Agree',
                    handler: ()=>{
                      this.presentLoad('Adding deposit...');
                      this.depositsProvider.addDeposit(this.deposit)
                      .then(result=>{
                        this.loading.dismiss();
                        this.presentToast('Deposit added!');
                        alert.dismiss();
                        this.getDeposits();
                      },err=>{
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
    alert.present();
  }

  close(){
    this.viewCtrl.dismiss();
  }

}
