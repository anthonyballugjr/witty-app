import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReportsProvider } from '../../providers/reports/reports';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { Chart } from 'chart.js';
import { BGColor, HoverColor } from '../../data/data';

@IonicPage()
@Component({
  selector: 'page-view-archive',
  templateUrl: 'view-archive.html',
})
export class ViewArchivePage {
  @ViewChild('donutCanvas') donutCanvas;
  summaryData: any;

  donutChart: any;
  eWallets: any;
  names: any = [];
  amounts: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public reportsProvider: ReportsProvider, private viewCtrl: ViewController, public expensesProvider: ExpensesProvider) {
    this.summaryData = this.navParams.get('summaryData');
    console.log(this.summaryData);
    this.initiate();
  }

  async initiate() {
    await this.getExpenseWallets();
  }

  dChart() {
    Chart.defaults.global.legend.position = 'bottom';
    this.donutChart = new Chart(this.donutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.names,
        datasets: [{
          label: 'Expense Wallet Allocation',
          data: this.amounts,
          backgroundColor: BGColor,
          hoverBackgroundColor: HoverColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: `${this.summaryData.period} Allocated Expense Wallets`,
          display: true,
        },
        animation: {
          animateScale: true
        }
      }
    });
  }

  getExpenseWallets() {
    this.expensesProvider.getWallets(this.summaryData.period)
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
        this.dChart();
      });
  }


  close() {
    this.viewCtrl.dismiss();
  }


}
