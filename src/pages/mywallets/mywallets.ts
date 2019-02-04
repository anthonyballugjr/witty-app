import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { ReportsProvider } from '../../providers/reports/reports';
import { SavingsProvider } from '../../providers/savings/savings';
import { BillsPage } from '../bills/bills';
import { Chart } from 'chart.js';
import { BGColor, HoverColor } from '../../data/data';
import { Events } from 'ionic-angular';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { ViewDepositsPage } from '../view-deposits/view-deposits';
import { Reminders } from '../../data/reminders';

@IonicPage()
@Component({
  selector: 'page-mywallets',
  templateUrl: 'mywallets.html'
})

export class MywalletsPage {
  reminders = Reminders;
  remind: any;

  barChart: any;
  lineChart: any;

  categories: any;
  wallets: any;
  x: any[] = [];
  budgetOverview: any = [];
  period = localStorage.period;

  archives: any;
  archiveX: any;
  archivePeriod: any = [];
  archiveTotalBudget: any = [];
  archiveTotalExpenses: any = [];
  archiveTotalDeposits: any = [];

  names: any = [];
  amounts: any[] = [];

  notifData: any;
  categoryID: any;

  alert: any;
  counter: number;
  surprise: boolean;

  eWallets: any;
  sWallets: any;

  safeSvg: any;
  emergency: any = [];
  emWallet: any;


  constructor(public reportsProvider: ReportsProvider, private alertCtrl: AlertController, public expensesProvider: ExpensesProvider, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private events: Events, public categoryProvider: CategoryProvider, private loadCtrl: LoadingController, private screenOrientation: ScreenOrientation, public savingsProvider: SavingsProvider) {
    this.doAll();
    this.remind = this.reminders[Math.floor(Math.random() * this.reminders.length)];
    this.presentReminder();
    console.log('Orientation', this.screenOrientation.type);
    this.counter = 0;
    this.surprise = false;
    this.events.subscribe('count:changed', count => {
      if (count === 10) {
        this.surprise = true;
      }
    });
  }

  presentReminder() {
    let reminder = this.alertCtrl.create({
      title: 'Witty Reminder',
      subTitle: this.remind.subTitle,
      buttons: ['Got it']
    });
    reminder.present();
  }

  add() {
    let modal = this.modalCtrl.create(BillsPage);
    modal.present();
  }
  getE() {
    this.categoryProvider.getAllExpenseWallets()
      .then(data => {
        this.eWallets = data;
        console.log('Ewallets', this.eWallets);
      }, err => {
        console.log(err);
      });

  }
  getS() {
    this.categoryProvider.getAllSavingsWallet()
      .then(data => {
        this.sWallets = data;
        console.log('Swallets', this.sWallets);
      }, error => {
        console.log(error);
      });
  }

  getEmergency() {
    this.savingsProvider.getE()
      .then(data => {
        this.emergency = data;
        this.emWallet = this.emergency[0];
        console.log('EMWALLET', this.emWallet);
      });
  }

  viewTransactions(id, name, wallet) {
    let modal = this.modalCtrl.create(ViewtransactionsPage, { _id: id, walletName: name, wallet: wallet });
    modal.onDidDismiss(() => {
      this.getE();
      this.getS();
    });
    modal.present();
  }
  viewDeposits(id, name) {
    let modal = this.modalCtrl.create(ViewDepositsPage, { _id: id, walletName: name });
    modal.onDidDismiss(() => {
      this.getE();
      this.getS();
    });
    modal.present();
  }

  saveArchive() {
    this.reportsProvider.saveArchive(this.budgetOverview)
      .then(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
  }

  count() {
    this.counter++;
    this.events.publish('count:changed', this.counter);
    console.log(this.counter);
  }

  getBudgetOverview() {
    this.reportsProvider.getBudgetOverview('October 2018')
      .then(data => {
        this.budgetOverview = data;
        console.log('Budget Overview', this.budgetOverview);
      }, err => {
        console.log(err);
      });
  }

  getExpenseWallets() {
    this.expensesProvider.getWallets(localStorage.period)
      .then(data => {
        this.wallets = data;
        for (let x of this.wallets) {
          this.x.push({ name: x.name, amount: x.amount });
          this.names.push(x.name);
          this.amounts.push(x.amount);
        }
        console.log(this.x);
        console.log('names', this.names);
        console.log('amounts', this.amounts);
        console.log(data);
      });
  }

  getArchives() {
    this.reportsProvider.getArchivesOverview()
      .then(data => {
        this.archives = data;
        this.archiveX = this.archives.x;
        for (let ar of this.archiveX) {
          this.archivePeriod.push(ar.period);
          this.archiveTotalBudget.push(ar.totalBudget);
          this.archiveTotalExpenses.push(ar.totalExpenses);
          this.archiveTotalDeposits.push(ar.totalSavings);
        }
        console.log('periods', this.archivePeriod);
        console.log('budgets', this.archiveTotalBudget);
        console.log('deposits', this.archiveTotalDeposits);
        console.log('archives', this.archives);
      }, err => {
        console.log(err);
      });
  }

  async doAll() {
    await this.getExpenseWallets();
    await this.getArchives();
    await this.getBudgetOverview();
    // await this.getbarChart();
    // await this.getLineChart();
    await this.getE();
    await this.getS();
    await this.getEmergency();
  }

}
