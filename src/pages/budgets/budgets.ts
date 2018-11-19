import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ReportsProvider } from '../../providers/reports/reports';
import { ViewBudgetPage } from '../view-budget/view-budget';
import { Chart } from 'chart.js';

@IonicPage()
@Component({
  selector: 'page-budgets',
  templateUrl: 'budgets.html',
})
export class BudgetsPage {

  view: string = "charts";
  overview: any;
  archives: any;

  @ViewChild('lineBudgets') lineBudgets;
  @ViewChild('lineExpenses') lineExpenses;
  @ViewChild('lineSavings') lineSavings;
  budgetChart: any;
  savingChart: any;
  expenseChart: any;
  periods: any = [];
  budgets: any = [];
  savings: any = [];
  expenses: any = [];

  constructor(private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public reportsProvider: ReportsProvider) {
    this.getArchives();
  }

  isChart() {
    this.periods = [];
    this.budgets = [];
    this.savings = [];
    this.expenses = [];
    this.getArchives();
  }

  async doAll(){
    await this.getArchives();
  }
  
  getArchives() {
    this.reportsProvider.getArchivesOverview()
      .then(data => {
        this.overview = data;
        this.archives = this.overview.x;
        for (let x of this.archives) {
          this.periods.push(x.period);
          this.budgets.push(x.totalBudget);
          this.savings.push(x.totalSavings);
          this.expenses.push(x.totalExpenses);
        }
        console.log('Overview', this.overview);
        console.log('Archives', this.archives);
      })
      .then(()=>{
        this.getLineBudgets();
        this.getLineExpenses();
        this.getLineSavings();
      })
  }

  viewBudget(period) {
    let modal = this.modalCtrl.create(ViewBudgetPage, { period: period });
    modal.present();
  }

  getLineBudgets() {
    this.budgetChart = new Chart(this.lineBudgets.nativeElement, {
      type: 'line',
      data: {
        labels: this.periods,
        datasets: [
          {
            label: 'Budget',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderCapStyle: 'butt',
            boderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(255, 99, 132, 0.8)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(255, 99, 132, 0.8),1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.budgets,
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

  getLineSavings() {
    this.savingChart = new Chart(this.lineSavings.nativeElement, {
      type: 'line',
      data: {
        labels: this.periods,
        datasets: [
          {
            label: 'Savings',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderCapStyle: 'butt',
            boderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(54, 162, 235, 0.8)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.savings,
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
          text: `Savings History`,
          display: true
        }
      }
    });
  }

  getLineExpenses() {
    this.expenseChart = new Chart(this.lineExpenses.nativeElement, {
      type: 'line',
      data: {
        labels: this.periods,
        datasets: [
          {
            label: 'Expenses',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(255, 206, 86, 0.8)',
            borderCapStyle: 'butt',
            boderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(255, 206, 86, 0.8)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(255, 206, 86, 0.8)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.expenses,
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
          text: `Expenses History`,
          display: true
        }
      }
    });
  }


}
