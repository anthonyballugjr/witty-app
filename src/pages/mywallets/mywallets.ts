import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ModalController, Slides, LoadingController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { ReportsProvider } from '../../providers/reports/reports';
import { BillsPage } from '../bills/bills';
import { Chart } from 'chart.js';
import { BGColor, HoverColor } from '../../data/data';
import { Events } from 'ionic-angular';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { ViewDepositsPage } from '../view-deposits/view-deposits';
import { Challenges } from '../../data/reminders';
import { DomSanitizer } from '@angular/platform-browser';


@IonicPage()
@Component({
  selector: 'page-mywallets',
  templateUrl: 'mywallets.html'
})

export class MywalletsPage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  reminders = Challenges;
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


  constructor(public reportsProvider: ReportsProvider, private plt: Platform, private alertCtrl: AlertController, public expensesProvider: ExpensesProvider, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private events: Events, public categoryProvider: CategoryProvider, private loadCtrl: LoadingController, private sanitizer: DomSanitizer) {
    this.doAll();
    this.logoLoad();
    this.remind = this.reminders[Math.floor(Math.random() * this.reminders.length)];
    // this.presentReminder();

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

  getbarChart() {
    Chart.defaults.global.legend.position = 'top';
    this.barChart = new Chart(this.barCanvas.nativeElement, {

      type: 'bar',
      data: {
        labels: this.archivePeriod,
        datasets: [
          {
            label: 'Budget',
            data: this.archiveTotalBudget,
            backgroundColor: BGColor,
            borderColr: HoverColor,
            borderWidth: 1
          },
          {
            label: 'Expenses',
            data: this.archiveTotalExpenses,
            backgroundColor: BGColor,
            borderColr: HoverColor,
            borderWidth: 1
          },
          {
            label: 'Savings',
            data: this.archiveTotalDeposits,
            backgroundColor: BGColor,
            borderColr: HoverColor,
            borderWidth: 1
          }
        ]
      },
      options: {
        animation: {
          animateScale: true
        },
        // responsive: true,
        // maintainAspectRatio: false,
        title: {
          text: `This months's budget`,
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  getLineChart() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: this.archivePeriod,
        datasets: [
          {
            label: 'Budget',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderCapStyle: 'butt',
            boderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.archiveTotalBudget,
            spanGaps: false
          }
        ]
      },
      options: {
        animation: {
          animateScale: true
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: `Budget History`,
          display: true
        }
      }
    });
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

  logoLoad() {
    let svg = `<svg width="100" height="100">
            <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
          </svg>`;

    this.safeSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
    let logo = this.loadCtrl.create({
      spinner: 'hide',
      content: `<div><img src="assets/imgs/logo.gif" height="100px"/></div>`
    });
    logo.present();

    setTimeout(() => {
      logo.dismiss();
    }, 5000);
  }

  async doAll() {
    await this.getExpenseWallets();
    await this.getArchives();
    await this.getBudgetOverview();
    await this.getbarChart();
    await this.getLineChart();
    await this.getE();
    await this.getS();
  }

}
