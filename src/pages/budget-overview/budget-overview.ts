import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { SavingsProvider } from '../../providers/savings/savings';
import { ViewArchivePage } from '../view-archive/view-archive';
import { ReportsProvider } from '../../providers/reports/reports';
import { Chart } from 'chart.js';
import { BGColor, HoverColor } from '../../data/data';


@IonicPage()
@Component({
  selector: 'page-budget-overview',
  templateUrl: 'budget-overview.html',
})
export class BudgetOverviewPage {
  @ViewChild('doughnutCanvas') doughnutCanvas;

  view: string = "thisMonth";
  profile: boolean = false;
  doughnutChart: any;

  period = localStorage.period;

  eWallets: any;
  sWallets: any;
  expenses: any = [];
  names: any = [];
  amounts: any = [];
  reportData: any;
  budgetOverview: any = [];
  periodDeposits: any = [];
  dep: any;

  descending: boolean = true;
  order: number;
  column: string = 'period';
  by: string = 'Ascending';

  constructor(public reportsProvider: ReportsProvider, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private viewCtrl: ViewController, public expensesProvider: ExpensesProvider, public savingsProvider: SavingsProvider) {
    this.doAll();
    this.profile = this.navParams.get('profile');
    console.log('Profile', this.profile);

  }

  async doAll() {
    await this.getExpenseWallets();
    await this.getArchivesOverview();
    await this.getCurrentBudgetOverview();
  }

  isChart() {
    this.names = [];
    this.amounts = [];
    this.getExpenseWallets();
  }

  chart() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: this.names,
        datasets: [
          {
            label: 'wallet amount',
            data: this.amounts,
            backgroundColor: BGColor,
            hoverBackgroundColor: HoverColor
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: `${this.period} Allocated Expense Wallets`,
          display: true,
        },
        animation: {
          animateScale: true
        },
        legend:{
          display: true,
          boxWidth: 20,
          position: 'bottom', 
        }
      }
    });
  }

  close() {
    this.viewCtrl.dismiss();
    this.profile = false;
  }

  sort() {
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
    if (!this.descending) this.by = 'Descending';
    else this.by = 'Ascending';
  }

  getCurrentBudgetOverview() {
    this.reportsProvider.getBudgetOverview(localStorage.period)
      .then(data => {
        this.budgetOverview = data;
        console.log('budgetOverview: ', this.budgetOverview);
      });
  }

  getExpenseWallets() {
    this.expensesProvider.getWallets(localStorage.period)
      .then(data => {
        this.eWallets = data;
        for (let x of this.eWallets) {
          this.amounts.push(x.amount);
          this.names.push(x.name);
        }
        console.log('Amounts', this.amounts);
        console.log('Names', this.names);
      })
      .then(() => {
        this.chart();
      });
  }

  getArchivesOverview() {
    this.reportsProvider.getArchivesOverview()
      .then(data => {
        this.reportData = data;
        console.log('Archives Overview', this.reportData);
      }, err => {
        console.log(err);
      });
  }

  viewSummary(data) {
    let modal = this.modalCtrl.create(ViewArchivePage, { summaryData: data });
    modal.present();
  }
}
