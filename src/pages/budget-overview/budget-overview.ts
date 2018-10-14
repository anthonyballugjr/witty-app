import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
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

  wallets: any;
  expenses: any = [];
  names: any = [];
  amounts: any = [];
  reportData: any;
  budgetOverview: any;


  descending: boolean = true;
  order: number;
  column: string = 'period';
  by: string = 'Ascending';

  constructor(public reportsProvider: ReportsProvider, public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private viewCtrl: ViewController) {
    this.getWallets();
    this.getArchivesOverview();
    this.getCurrentBudgetOverview();
    this.profile = this.navParams.get('profile');
    console.log('Profile', this.profile);
  }

  isChart() {
    this.names = [];
    this.amounts = [];
    this.getWallets();
  }

  chart() {
    Chart.defaults.global.legend.position = 'bottom';
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: this.names,
        datasets: [{
          label: 'wallet amount',
          data: this.amounts,
          backgroundColor: BGColor,
          hoverBackgroundColor: HoverColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: this.period + " Wallets"
        },
        animation: {
          animateScale: true
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
    this.reportsProvider.getCurrentBudgetOverview()
      .then(data => {
        this.budgetOverview = data;
        console.log(this.budgetOverview);
      });
  }

  getWallets() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        for (let x of this.wallets) {
          this.amounts.push(x.amount);
          this.names.push(x.name)
        }
        this.chart();
        console.log(this.amounts);
        console.log(this.names);
      });
  }

  getArchivesOverview() {
    this.reportsProvider.getArchivesOverview()
      .then(data => {
        this.reportData = data;
        console.log(this.reportData);
      }, err => {
        console.log(err);
      });
  }

  viewSummary(data) {
    let modal = this.modalCtrl.create(ViewArchivePage, { summaryData: data });
    modal.present();
  }
}
