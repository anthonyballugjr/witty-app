import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
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
import { Categories } from '../../data/data';

@IonicPage()
@Component({
  selector: 'page-mywallets',
  templateUrl: 'mywallets.html'
})

export class MywalletsPage {
  @ViewChild('pieCanvas') pieCanvas
  pieChart: any;
  c = Categories;
  y: any;
  categoryNames: any = [];
  categoryTransactions: any = [];


  reminders = Reminders;
  remind: any;

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
  // amounts: any[] = [];

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


  constructor(public reportsProvider: ReportsProvider, private alertCtrl: AlertController, public expensesProvider: ExpensesProvider, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private events: Events, public categoryProvider: CategoryProvider, private screenOrientation: ScreenOrientation, public savingsProvider: SavingsProvider) {
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

  ionViewDidLoad() {

  }

  getPieChart() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.categoryNames,
        datasets: [
          {
            label: 'transactions',
            data: this.categoryTransactions,
            backgroundColor: BGColor,
            HoverBackgroundColor: HoverColor
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: `${localStorage.period} Expenses by Category`,
          display: true
        },
        animation: {
          animateScale: true,
          duration: 2000
        }
      }
    });
  }

  getTransactionsOverview() {
    this.c.forEach(x => {
      this.expensesProvider.tOverview(localStorage.period, x._id, localStorage.userId)
        .then(data => {
          this.y = data;
          if (this.y.category !== "") {
            this.categoryNames.push(this.y.category);
            this.categoryTransactions.push(this.y.totalTransactions);
          }
        });
    });
    console.log(this.categoryNames, this.categoryTransactions);
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
    await this.getArchives();
    await this.getBudgetOverview();
    // await this.getbarChart();
    // await this.getLineChart();
    await this.getE();
    await this.getS();
    await this.getEmergency();
    await this.getTransactionsOverview();
    await this.getPieChart();
  }

}
