import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ModalController, Slides } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { ReportsProvider } from '../../providers/reports/reports';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BillsPage } from '../bills/bills';
import { Chart } from 'chart.js';
import moment from 'moment';
import { BGColor, HoverColor } from '../../data/data';
import { Events } from 'ionic-angular';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { ViewDepositsPage } from '../view-deposits/view-deposits';
import { Challenges } from '../../data/reminders';


@IonicPage()
@Component({
  selector: 'page-mywallets',
  templateUrl: 'mywallets.html'
})

export class MywalletsPage {
  // @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('categoryInput') categoryInput;
  @ViewChild('slider') slider: Slides;

  reminders = Challenges;
  remind: any;
  

  barChart: any;
  doughnutChart: any;
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

  cat = {
    id: '',
    desc: ''
  }

  names: any = [];
  amounts: any[] = [];

  notifData: any;
  categoryID: any;

  alert: any;
  counter: number;
  surprise: boolean;

  eWallets: any;
  sWallets: any;


  constructor(public reportsProvider: ReportsProvider, private plt: Platform, private localNotif: LocalNotifications, private alertCtrl: AlertController, public expensesProvider: ExpensesProvider, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private events: Events, public categoryProvider: CategoryProvider) {
    this.doAll();
    this.remind = this.reminders[Math.floor(Math.random() * this.reminders.length)];
    this.presentReminder();

    this.counter = 0;
    this.surprise = false;
    this.events.subscribe('count:changed', count => {
      if (count === 10) {
        this.surprise = true;
      }
    });
    
  }

  presentReminder(){
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

  async doAll() {
    await this.getExpenseWallets();
    await this.getbarChart();
    await this.getLineChart();
    await this.getBudgetOverview();
    await this.getArchives();
    await this.getE();
    await this.getS();
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
        labels: this.names,
        datasets: [{
          label: 'Wallet amount',
          data: this.amounts,
          backgroundColor: BGColor,
          borderColr: HoverColor,
          borderWidth: 1
        }]
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
          },
          {
            label: 'Expenses',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,120,192,0.4)',
            borderCapStyle: 'butt',
            boderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,120,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,120,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.archiveTotalExpenses,
            spanGaps: false
          },
          {
            label: 'Savings',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,50,50,0.4)',
            borderCapStyle: 'butt',
            boderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,50,50,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,50,50,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.archiveTotalDeposits,
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

  ionViewDidLoad() {
    console.log('Play! Play! Play!');
  }

  openCategories() {
    let modal = this.modalCtrl.create(BillsPage);
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        console.log(data);
        this.cat.desc = data.desc;
        this.cat.id = data._id;
      }
    })
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
        console.log('periods', this.archivePeriod, 'budgets', this.archiveTotalBudget);
        console.log('archives', this.archives);
      }, err => {
        console.log(err);
      });
  }

}
