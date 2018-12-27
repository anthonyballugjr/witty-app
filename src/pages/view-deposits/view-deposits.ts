import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { DepositsProvider } from '../../providers/deposits/deposits';
import { TransactionsProvider } from '../../providers/transactions/transactions';


@IonicPage()
@Component({
  selector: 'page-view-deposits',
  templateUrl: 'view-deposits.html',
})
export class ViewDepositsPage {
  view: string = "deposits";


  deposit = {
    amount: '',
    walletId: '',
    period: localStorage.period
  }
  deposits: any;
  totalDeposits: any;

  withdrawal = {
    desc: 'withdrawal',
    walletId: '',
    amount: ''
  }
  withdrawals: any;
  totalWithdrawals: any;

  walletId: any;
  walletName: any;
  wallet: any;

  prompt: any;
  loading: any;
  result: any;
  depositData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private alertCtrl: AlertController, private loadCtrl: LoadingController, private toastCtrl: ToastController, public depositsProvider: DepositsProvider, public transactionsProvider: TransactionsProvider) {
    this.wallet = this.navParams.get('wallet');
    this.walletId = this.navParams.get('_id');
    this.walletName = this.navParams.get('walletName');
    this.doAll();
  }

  async doAll() {
    await this.presentLoad('Fetching wallet data...');
    await this.getDeposits();
    await this.getTransactions();
    await this.loading.dismiss();
  }

  presentLoad(content) {
    this.loading = this.loadCtrl.create({
      spinner: 'hide',
      content: `<div>
      <div class="loader"><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>${content}</p>
      </div>`
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

  getDeposits() {
    this.depositsProvider.getDeposits(this.walletId)
      .then(data => {
        this.deposits = data;
        var a = - 0;
        for (let x of this.deposits) {
          a += x.amount;
        }
        this.totalDeposits = a;
        console.log('Total Deposits', this.totalDeposits);
        console.log('Deposits', this.deposits);
      }, err => {
        this.loading.dismiss();
        console.log(err);
      });
  }

  getTransactions() {
    this.transactionsProvider.getTransactions(this.wallet._id)
      .then(data => {
        this.withdrawals = data;
        var a = 0;
        for (let x of this.withdrawals) {
          a += x.amount;
        }
        this.totalWithdrawals = a;
        console.log('Total Withdrawals', this.totalWithdrawals);
        console.log('Withdrawals', this.withdrawals);
      }, err => {
        this.loading.dismiss();
        console.log(err);
      });
  }

  addDeposit() {
    let alert = this.alertCtrl.create({
      title: 'New Deposit',
      enableBackdropDismiss: false,
      subTitle: 'Add new deposit to this saving wallet',
      inputs: [
        {
          name: 'amount',
          label: 'Amount',
          type: 'number',
          placeholder: 'Enter amount to deposit'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: (data) => {
            if (data.amount === '') {
              this.presentToast('Amount must not be empty');
              return false;
            }
            else {
              this.deposit.walletId = this.walletId;
              this.deposit.period = localStorage.period;
              this.deposit.amount = data.amount;
              let confirm = this.alertCtrl.create({
                subTitle: 'Add deposit?',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Agree',
                    handler: () => {
                      this.presentLoad('Adding deposit...');
                      this.depositsProvider.addDeposit(this.deposit)
                        .then(result => {
                          this.loading.dismiss();
                          this.presentToast('Deposit added!');
                          alert.dismiss();
                          this.getDeposits();
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
    alert.present();
  }

  addTransaction() {
    this.prompt = this.alertCtrl.create({
      title: 'New Withdrawal',
      enableBackdropDismiss: false,
      subTitle: 'Withdraw from this wallet',
      message: `Remaining Amount: ₱${(this.totalDeposits - this.totalWithdrawals).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`,
      inputs: [
        {
          label: 'Amount',
          type: 'number',
          name: 'amount',
          placeholder: 'Enter amount to withdraw'
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
            if (data.amount === '') {
              this.presentToast('Amount must not be empty');
              return false;
            }
            else if ((data.amount > this.totalDeposits) || ((parseFloat(data.amount) + parseFloat(this.totalWithdrawals)) > this.totalDeposits)) {
              let warning = this.alertCtrl.create({
                title: 'Oops!',
                subTitle: 'You do not have enough saving deposits to make this transaction',
                buttons: [
                  {
                    text: 'Ok',
                    role: 'cancel'
                  }
                ]
              });
              warning.present();
              return true;
            }

            else {
              this.withdrawal.amount = data.amount;
              this.withdrawal.walletId = this.wallet._id;
              let confirm = this.alertCtrl.create({
                subTitle: 'Continue transaction?',
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
                      this.presentLoad('Updating wallet...');
                      this.transactionsProvider.addTransaction(this.withdrawal)
                        .then((result) => {
                          console.log(result);
                          this.loading.dismiss();
                          this.presentToast('Withdrawal Successful!');
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

  close() {
    this.viewCtrl.dismiss();
  }

}
