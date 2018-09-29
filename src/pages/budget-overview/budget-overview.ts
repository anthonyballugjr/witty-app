import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
import { ViewArchivePage } from '../view-archive/view-archive';
import { ReportsProvider } from '../../providers/reports/reports';


@IonicPage()
@Component({
  selector: 'page-budget-overview',
  templateUrl: 'budget-overview.html',
})
export class BudgetOverviewPage {
  overview: string = "thisMonth";

  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  n = new Date();
  m = this.month[this.n.getMonth()];
  y = this.n.getFullYear();
  period = this.m + " " + this.y;

  wallets: any;
  expenses: any = [];
  reportData: any;

  descending: boolean = true;
  order: number;
  column: string = 'period';
  by: string = 'Ascending';

  constructor(public reportsProvider: ReportsProvider, public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) {
    this.getWallets();
    this.getOverview();
  }

  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1: -1;
    if(!this.descending) this.by = 'Descending';
    else this.by = 'Ascending';
  }

  getWallets() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        for (let i of this.wallets) {
          for (let x of i.transactions) {
            this.expenses.push(x);
          }
        }
        console.log(this.wallets);
        console.log(this.expenses);
      });
  }

  getOverview() {
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
