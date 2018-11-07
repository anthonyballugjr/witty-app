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

  barChart: any;
  doughnutChart: any;
  lineChart: any;


  transactions: any = [];
  categories: any;
  wallets: any;
  x: any[] = [];
  next: any = [];
  nextD: any;
  budgetOverview: any = [];
  savingsOverview: any = [];
  all: any = [];
  period = localStorage.period;

  archives: any;
  archiveX: any;
  archivePeriod: any = [];
  archiveTotalBudget: any = [];
  archiveTotalExpenses: any = [];

  cat = {
    id: '',
    desc: ''
  }

  names: any = [];
  amounts: any[] = [];

  xyz: any;
  def: any = [];

  predictData: any = [];

  notifData: any;
  categoryID: any;

  alert: any;
  counter: number;
  surprise: boolean;


  constructor(public reportsProvider: ReportsProvider, private plt: Platform, private localNotif: LocalNotifications, private alertCtrl: AlertController, public expensesProvider: ExpensesProvider, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private events: Events) {
    this.doAll();

    this.counter = 0;
    this.surprise = false;
    this.events.subscribe('count:changed', count => {
      if (count === 10) {
        this.surprise = true;
      }
    })
  }

  async doAll() {
    await this.getExpenseWallets();
    await this.getbarChart();
    await this.getLineChart();
    await this.getBudgetOverview();
    await this.getArchives();
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
            label: 'Total Budget',
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
          text: `This months's budget`,
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
        }
        console.log('periods', this.archivePeriod, 'budgets', this.archiveTotalBudget);
      }, err => {
        console.log(err);
      });
  }

}
