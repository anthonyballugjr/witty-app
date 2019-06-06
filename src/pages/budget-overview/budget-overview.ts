import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Icon } from 'ionic-angular';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { SavingsProvider } from '../../providers/savings/savings';
import { ViewArchivePage } from '../view-archive/view-archive';
import { ReportsProvider } from '../../providers/reports/reports';
import { Chart } from 'chart.js';
import { BGColor, HoverColor } from '../../data/data';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-budget-overview',
  templateUrl: 'budget-overview.html',
})
export class BudgetOverviewPage {
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('barCanvas') barCanvas;
  doughnutChart: any;
  barChart: any;

  view: string = "thisMonth";
  profile: boolean = false;
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
  barAmounts: any = [];
  barNames: any = [];

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
    await this.getCurrentBudgetOverview();
    await this.getExpenseWallets();
    await this.getArchivesOverview();
  }

  isChart() {
    this.barNames = [];
    this.barAmounts = [];
    this.names = [];
    this.amounts = [];
    this.getExpenseWallets();
    this.getCurrentBudgetOverview();
  }

  getBarChart() {
    console.log('bar1', this.barAmounts[1]);
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: this.barNames,
        datasets: [
          {
            label: 'Amount in ₱',
            data: this.barAmounts,
            backgroundColor: 'rgba(67,132,150, 0.8)',
            borderColor: "rgba(67,132,150, 1)",
            borderWidth: 1
          }
        ]
      },
      options: {
        title: { text: `${localStorage.period} Status`, display: true },
        legend: {
          display: true,
          boxWidth: 20,
          position: 'top'
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  getDoughnutChart() {
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
          text: `${this.period} Expense Wallets Allocation`,
          display: true,
        },
        animation: {
          animateScale: true
        },
        legend: {
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

        this.barNames.push('Total Budget(Money In)', 'Expenses (Money Out)');
        this.barAmounts.push(this.budgetOverview.totalBudget, this.budgetOverview.totalExpenses);
        console.log('budgetOverview: ', this.budgetOverview);
      })
      .then(() => {
        this.getBarChart();
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
        this.getDoughnutChart();
      });
  }

  // getSavingsWallets() {
  //   this.savingsProvider.getWallets()
  //     .then(data => {
  //       this.sWallets = data;
  //       var totalDeposits = 0;
  //       var totalWithdrawals = 0;
  //       for (let x of this.sWallets) {
  //         for (let i of x.deposits) {
  //           if (i.period === localStorage.period) {
  //             totalDeposits += i.amount
  //           }
  //         }
  //         for (let m of x.withdrawals) {
  //           if (m.created === localStorage.period) {
  //             totalWithdrawals += m.amount
  //           }
  //         }
  //       }
  //       var currentMonthSavings = totalDeposits - totalWithdrawals;
  //       console.log('W', totalWithdrawals);
  //       console.log('D', totalDeposits);
  //       this.names.push('Savings');
  //       this.amounts.push(currentMonthSavings);
  //     });
  // }

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
