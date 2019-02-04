import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, Slides, LoadingController, AlertController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ReportsProvider } from '../../providers/reports/reports';
import { SavingsProvider } from '../../providers/savings/savings';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { DepositsProvider } from '../../providers/deposits/deposits';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { BillsPage } from '../bills/bills';
import { AddwalletPage } from '../addwallet/addwallet';
import { ViewDepositsPage } from '../view-deposits/view-deposits';
import { CreateBudgetPage } from '../create-budget/create-budget';
import { pPeriod } from '../../data/period';
import { Reminders } from '../../data/reminders'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('slider') slider: Slides;
  page: string = "0";
  period = localStorage.period;
  nickname = localStorage.nickname;

  sWallets: any;
  eWallets: any;
  prevWallets: any;
  monthDeposits: any;
  monthWithdrawals: any;
  overview: any = [];

  isSavings: boolean = false;

  loading: any;
  alert: any;

  names: any = [];
  predicted: any = [];
  pWallet: any;
  x: any;
  y: any = [];
  forArchive: any;
  isDone: any;

  archivedData: any;
  oldWallets: any = [];
  newWallets: any = [];

  reminders = Reminders;
  remind: any;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private toastCtrl: ToastController, public navParams: NavParams, public navCtrl: NavController, public http: HttpClient, public expensesProvider: ExpensesProvider, public savingsProvider: SavingsProvider, public reportsProvider: ReportsProvider, private events: Events, public depositsProvider: DepositsProvider) {
    this.isDone = localStorage.getItem('bStat');
    this.events.subscribe('done:changed', done => {
      if (this.isDone === 'undone' || this.isDone === undefined) {
        this.isDone = done;
      }
    });
    this.remind = this.reminders[Math.floor(Math.random() * this.reminders.length)];
    this.doAll();
  }

  async doAll() {
    await this.check();
    await this.getExpenseWallets();
    await this.getPreviousExpenseWallets();
    await this.getSavingsWallets();
    await this.getCurrentBudgetOverview();
    await this.createBudget();
    await this.presentReminder();
  }

  async presentReminder() {
    if (localStorage.reminder === 'false') {
      await this.presentAlert('Witty Reminder', this.remind.subTitle, 'Got it!');
      await localStorage.setItem('reminder', 'true');
    }

  }

  presentAlert(title, msg, button) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: [button]
    });
    this.alert.present();
  }

  presentLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: `<div>
      <div class="loader"><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>${msg}</p>
      </div>`,
      spinner: 'hide'
    });
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      dismissOnPageChange: false
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  getCurrentBudgetOverview() {
    this.reportsProvider.getBudgetOverview(localStorage.period)
      .then(data => {
        this.overview = data;
        console.log('xxx', this.overview);
      }, err => {
        console.log(err);
      });
  }

  getPreviousExpenseWallets() {
    this.expensesProvider.getWallets(pPeriod)
      .then(data => {
        this.prevWallets = data;
        for (let wallet of this.prevWallets) {
          this.names.push(wallet.name);
        }
        console.log('Expense Wallets', this.eWallets);
        console.log('Names', this.names);
      }, err => {
        console.log(err);
      });
  }

  getExpenseWallets() {
    this.expensesProvider.getWallets(localStorage.period)
      .then(data => {
        this.eWallets = data;
        console.log('Expense Wallets', this.eWallets);
      }, err => {
        console.log(err);
      });
  }

  getSavingsWallets() {
    this.savingsProvider.getWallets()
      .then(data => {
        this.sWallets = data;
        var totalDep = 0;
        var totalWith = 0;
        for (let s of this.sWallets) {
          for (let x of s.deposits) {
            if (x.period === localStorage.period) {
              totalDep += x.amount;
            }
          }
        }
        for (let s of this.sWallets) {
          for (let x of s.withdrawals) {
            if (x.created === localStorage.period) {
              totalWith += x.amount;
            }
          }
        }
        this.monthDeposits = totalDep;
        this.monthWithdrawals = totalWith;
        console.log(`This month's deposits ${this.monthDeposits}`)
        console.log(`This month's withdrawals ${this.monthWithdrawals}`);
        console.log('Savings Wallets', this.sWallets);
      });
  }

  viewTransactions(id, name, wallet) {
    let modal = this.modalCtrl.create(ViewtransactionsPage, { _id: id, walletName: name, wallet: wallet });
    modal.onDidDismiss(() => {
      this.getExpenseWallets();
      this.getSavingsWallets();
    });

    modal.present();
  }

  viewDeposits(id, name, wallet) {
    let modal = this.modalCtrl.create(ViewDepositsPage, { _id: id, walletName: name, wallet: wallet });

    modal.onDidDismiss(() => {
      this.getExpenseWallets();
      this.getSavingsWallets();
    });
    modal.present();
  }

  addWallet() {
    let modal = this.modalCtrl.create(AddwalletPage, { isSavings: this.isSavings });
    modal.present();

    modal.onDidDismiss(data => {
      this.getSavingsWallets();
      this.getExpenseWallets();
      if (data) {
        console.log(data);
        this.presentLoading('Creating new wallet...');
        setTimeout(() => {
          this.expensesProvider.addWallet(data)
            .then(result => {
              console.log(result);
              // this.loading.dismiss();
              this.getExpenseWallets();
              this.getSavingsWallets();
              this.presentAlert('Success!', 'New Expense wallet created', 'Ok');
            }, err => {
              console.log(err);
              this.presentAlert('Failed', err.error, 'Ok');
            });
          this.loading.dismiss();
        }, 2000);
      }
    });
  }

  selectedTab(index) {
    this.slider.slideTo(index);
  }

  isChanged($event) {
    this.page = $event._snapIndex.toString();
    this.check();
  }

  willChange($event) {
    this.page = $event._snapIndex.toString();
  }

  check() {
    if (this.page === '0') {
      this.isSavings = false
    } else {
      this.isSavings = true;
    }
  }

  goToBills() {
    this.navCtrl.push(BillsPage);
  }

  createBudget() {
    // let today = moment().format('DD');
    // let firstDay = moment().startOf('month').format('DD');
    // console.log('Today', today);
    // if (today === firstDay && this.isLoggedIn && this.user.isNext === false) {
    if (this.isDone === 'undone') {
      let alert = this.alertCtrl.create({
        title: 'Create New Budget',
        subTitle: `Hello ${this.nickname.charAt(0).toUpperCase() + this.nickname.slice(1)}, It is the first day of the month. Witty is now ready to create your budget. Please choose how you want to create your budget this month. (SELECT AN OPTION FOR MORE DETAILS).`,
        enableBackdropDismiss: false,
        buttons: [
          {
            text: 'Automatic',
            handler: () => {
              let prompt = this.alertCtrl.create({
                title: 'Automatic (Recommended)',
                subTitle: `Choosing this option will create your wallets and set their amounts automatically for this month based on your historical data. Note that all wallets will be copied from the previous month. (if you want to edit what wallets you want to keep, choose "Modified" option).`,
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Continue',
                    handler: () => {
                      console.log('Chosen Automatic');
                      this.auto();
                      alert.dismiss();
                    }
                  },
                ]
              });
              prompt.present();
              return false;
            }
          },
          {
            text: 'Modified',
            handler: () => {
              let prompt = this.alertCtrl.create({
                title: 'Modified',
                subTitle: 'Choosing these option lets you edit what wallets you want to keep from the previous month. Afterwhich, Witty will automatically set their budgets for this month based on your historical data.',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Continue',
                    handler: () => {
                      console.log('Chosen Modified');
                      let modal = this.modalCtrl.create(CreateBudgetPage);
                      modal.present();
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
            text: 'Manual',
            handler: () => {
              let prompt = this.alertCtrl.create({
                title: 'Manual',
                subTitle: 'Choosing these option lets you manually create new wallets and set their budget. Note that previous wallets will not be used and you will be starting anew.',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel'
                  },
                  {
                    text: 'Continue',
                    handler: () => {
                      console.log('Chosen Manual');
                      this.manual();
                      alert.dismiss();
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
    }
  }

  //auto Creating new month budget
  async auto() {
    this.presentLoading('Please wait while Witty is creating your wallets...');

    await this.names.forEach(name => {
      this.expensesProvider.predict(name)
        .then(data => {
          this.x = data;
          this.y = this.x.x;
          for (let wallet of this.y) {
            if (wallet !== null) {
              this.predicted.push(wallet);
              this.newWallets.push(wallet);
              this.pWallet = wallet;
              this.expensesProvider.addWallet(this.pWallet)
                .then(res => {
                  console.log(res);
                }, err => {
                  console.log(err);
                });
            }
          }
        }, err => {
          this.presentToast(err);
          console.log(err);
        });
    });
    console.log('Predicted', this.predicted);

    await this.reportsProvider.getBudgetOverview(pPeriod)
      .then(data => {
        this.forArchive = data;
        console.log('For Archive', this.forArchive);
      }, err => {
        this.presentToast(err);
        console.log(err);
      });


    if (this.forArchive.extraSavings > 0) {
      let alert = this.alertCtrl.create({
        title: 'Extra Savings',
        subTitle: `You have ₱${this.forArchive.extraSavingstoFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} extra savings last month. Select where you like to deposit your extra savings`,
        buttons: [
          {
            text: ` I don't like to deposit`,
            handler: () => {
              let prompt = this.alertCtrl.create({
                subTitle: 'Are you sure you want to skip this step?',
                buttons: [
                  {
                    text: 'Go back',
                    role: 'cancel'
                  },
                  {
                    text: 'Agree',
                    handler: () => {
                      this.reportsProvider.saveArchive(this.forArchive)
                        .then(result => {
                          console.log(result);
                        }, err => {
                          console.log(err);
                        })
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
                      this.presentLoading(`Adding extra savings to ${data.name}...`)
                      this.depositsProvider.addDeposit(deposit)
                        .then(result => {
                          console.log(`Deposited to ${data.name}`, result);
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
          value: x
        });
      }
    } else {
      // this.forArchive.extraSavings = 0;
      await this.reportsProvider.saveArchive(this.forArchive)
        .then(result => {
          console.log('Archived', result);
        }, err => {
          console.log(err);
        });
    }
    await this.getExpenseWallets();
    await this.getSavingsWallets();
    this.isDone = 'done';
    localStorage.setItem('bStat', this.isDone);
    this.events.publish('done:changed', this.isDone);
    await this.loading.dismiss();
  }
  //End auto creating new budget

  async manual() {
    await this.reportsProvider.getBudgetOverview(pPeriod)
      .then(data => {
        this.forArchive = data;
        console.log('forArchive', this.forArchive);
      }, err => {
        console.log(err);
      });

    if (this.forArchive.extraSavings > 0) {

      let alert = this.alertCtrl.create({
        title: 'Extra Savings',
        subTitle: `You have ₱${this.forArchive.extraSavings.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} extra savings last month. Select where you want to deposit your extra savings.`,
        enableBackdropDismiss: false,
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
                        })
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
                      this.presentLoading(`Adding extra savings to ${data.name}...`)
                      this.depositsProvider.addDeposit(deposit)
                        .then(result => {
                          this.loading.dismiss();
                          console.log(result);
                        }, err => {
                          console.log(err);
                          this.loading.dismiss();
                        });

                      this.reportsProvider.saveArchive(this.forArchive)
                        .then(res => {
                          console.log('Archived', res);
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
      // this.forArchive.extraSavings = 0;
      this.reportsProvider.saveArchive(this.forArchive)
        .then(result => {
          console.log('Archived', result);
        }, err => {
          console.log(err);
        });
    }
  }

}
