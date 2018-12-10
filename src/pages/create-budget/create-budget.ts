import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { ReportsProvider } from '../../providers/reports/reports';
import { SavingsProvider } from '../../providers/savings/savings';
import { DepositsProvider } from '../../providers/deposits/deposits';
import { TabsPage } from '../tabs/tabs';
import { pPeriod } from '../../data/period';

@IonicPage()
@Component({
  selector: 'page-create-budget',
  templateUrl: 'create-budget.html',
})
export class CreateBudgetPage {
  @ViewChild('slider') slider: Slides;

  loading: any;
  alert: any;
  toast: any;
  sWallets: any;

  names: any = [];
  wallets: any;
  listData: any = [];
  overview: any;
  predicted: any = [];
  x: any;
  y: any = [];
  forArchive: any;
  emergency: any = [];
  emWallet: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public expensesProvider: ExpensesProvider, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private viewCtrl: ViewController, private toastCtrl: ToastController, public reportsProvider: ReportsProvider, public savingsProvider: SavingsProvider, public depositsProvider: DepositsProvider) {
    this.getExpenseWallets();
    this.getSavingsWallets();
    this.getBudgetOverview();
    this.getEmergency();
  }

  ionViewDidLoad() {
    console.log('Creating Next Budget');
    this.slider.lockSwipes(true);
  }

  presentAlert(title, content) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  presentLoading(msg) {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div>
      <div class="loader"><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>${msg}</p>
      </div>`
    });
    this.loading.present();
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      closeButtonText: 'I got it',
      showCloseButton: true,
      message: msg,
      position: 'bottom',
      duration: 10000
    });
    this.toast.present();
  }

  goToSlide(slideNo) {
    this.slider.lockSwipes(false);
    this.slider.slideTo(slideNo, 700);
    this.slider.lockSwipes(true);
  }

  exit() {
    let alert = this.alertCtrl.create({
      title: 'Warning!',
      subTitle: 'The budget creation process will be activated at a later time once cancelled, are you sure you want to skip this process?',
      buttons: [
        {
          text: 'No, continue creating budget',
          role: 'cancel'
        },
        {
          text: 'Yes, I will do this later',
          handler: () => {
            // this.viewCtrl.dismiss();
            this.navCtrl.setRoot(TabsPage);
          }
        }
      ]
    });
    alert.present();
  }

  done() {
    // this.viewCtrl.dismiss();
    this.navCtrl.setRoot(TabsPage);
  }

  getEmergency() {
    this.savingsProvider.getE()
      .then(data => {
        this.emergency = data;
        this.emWallet = this.emergency[0];
      }, err => {
        console.log(err);
      });
  }

  getExpenseWallets() {
    this.presentLoading('Fetching wallets...');
    this.expensesProvider.getWallets(pPeriod)
      .then(data => {
        this.wallets = data;
        for (let wallet of this.wallets) {
          this.names.push(wallet.name);
          this.listData.push({ name: wallet.name, category: wallet.category, type: wallet.type });
        }
        this.loading.dismiss();
        this.presentToast("Remove wallets you do not need for your next month's budget, if you are satisfied with your wallets, you can proceed by tapping the 'NEXT' button")
        console.log('List Data', this.listData);
        console.log('Names', this.names);
      }, err => {
        this.loading.dismiss();
        console.log(err);
      });
  }

  getSavingsWallets() {
    this.savingsProvider.getWallets()
      .then(data => {
        this.sWallets = data;
      }, err => {
        console.log(err);
      });
  }

  getBudgetOverview() {
    this.reportsProvider.getBudgetOverview(pPeriod)
      .then(data => {
        this.forArchive = data;
        console.log('Last month overview', this.forArchive);
      }, err => {
        console.log(err);
      });
  }

  remove(wallet) {
    let alert = this.alertCtrl.create({
      title: 'Remove Wallet',
      subTitle: 'Remove wallet from list?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            this.listData.pop(wallet);
            this.names.pop(wallet.name);
            console.log('List Data', this.listData);
          }
        }
      ]
    });
    alert.present();
  }

  predict() {
    if (this.predicted.length > 0) {
      this.goToSlide(1);
    }
    else {
      this.presentLoading('Predicting Values...');
      this.names.forEach(name => {
        this.expensesProvider.predict(name)
          .then(data => {
            this.x = data;
            this.y = this.x.x;
            for (let wallet of this.y) {
              if (wallet !== null) {
                this.predicted.push(wallet);
              }
            }
          });
      }, err => {
        this.loading.dismiss();
        console.log(err);
      });
      this.loading.dismiss();
      this.goToSlide(1);
      this.toast.dismiss();
    }
    console.log('Predicted Data', this.predicted);
    console.log(this.forArchive);
  }

  save() {
    this.presentLoading('Adding wallet for next month')
    this.expensesProvider.addWallet(this.predicted)
      .then(result => {
        this.loading.dismiss();
        console.log(result);
        if (this.forArchive.extraSavings > 0) {
          let alert = this.alertCtrl.create({
            title: 'Extra Savings',
            subTitle: `You have ₱${this.forArchive.extraSavingstoFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} extra savings last month. Select where yo want to deposit your extra savings.`,
            buttons: [
              {
                text: `I don't like to deposit`,
                handler: () => {
                  let prompt = this.alertCtrl.create({
                    subTitle: 'Are you sure you want to skip this step?',
                    buttons: [
                      {
                        text: 'Go back',
                        role: 'cancel'
                      },
                      {
                        text: 'Yes',
                        handler: () => {
                          this.reportsProvider.saveArchive(this.forArchive)
                            .then(result => {
                              console.log('Archived', result);
                            }, err => {
                              console.log(err);
                            });
                          alert.dismiss();
                        }
                      }
                    ]
                  });
                  prompt.present();
                  return false;
                }
              },
              {
                text: 'Continue',
                handler: (data) => {
                  let prompt = this.alertCtrl.create({
                    subTitle: `Deposit extra savings to ${data.name.toUpperCase()}?`,
                    buttons: [
                      {
                        text: 'Back',
                        role: 'cancel'
                      },
                      {
                        text: 'Agree',
                        handler: () => {
                          var amount = this.forArchive.extraSavings;
                          this.forArchive.extraSavings = 0;
                          var deposit = {
                            walletId: data._id,
                            amount: amount,
                            period: localStorage.period
                          }
                          this.presentLoading(`Adding extra savings to ${data.name}...`);
                          this.depositsProvider.addDeposit(deposit)
                            .then(result => {
                              console.log(result);
                              this.loading.dismiss();
                            }, err => {
                              this.loading.dismiss();
                              console.log(err);
                            });

                          this.reportsProvider.saveArchive(this.forArchive)
                            .then(result => {
                              console.log('Archived', result);
                            }, err => {
                              console.log(err);
                            });
                        }
                      }
                    ]
                  });
                  prompt.present();
                  return false;
                }
              }
            ]
          });
          alert.present();
          for (let x of this.sWallets) {
            alert.addInput({
              type: 'radio',
              label: x.name.toUpperCase(),
              value: x,
              handler: () => {
                console.log(x);
              }
            });
          }
        } else {
          this.reportsProvider.saveArchive(this.forArchive)
            .then(result => {
              console.log('Archived', result);
            }, err => {
              console.log(err);
            });
        }
        this.loading.dismiss();
        this.goToSlide(2);
        this.presentAlert('Success!', 'Wallets successfully created');

      }, err => {
        this.loading.dismiss();
        console.log(err);
        this.presentAlert('Failed', err.error);
      });
  }


}
