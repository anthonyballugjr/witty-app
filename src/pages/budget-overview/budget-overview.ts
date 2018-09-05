import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, NavParams } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
import { PopHomePage } from '../pop-home/pop-home';

@IonicPage()
@Component({
  selector: 'page-budget-overview',
  templateUrl: 'budget-overview.html',
})
export class BudgetOverviewPage {
  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  n = new Date();
  m = this.month[this.n.getMonth()];
  y = this.n.getFullYear();
  period = this.m + " " + this.y;

  wallets: any;
  expenses: any = [];



  constructor(private popCtrl: PopoverController, public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getWallets();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BudgetOverviewPage');
  }

  showPopover(event) {
    let pop = this.popCtrl.create(PopHomePage);
    pop.present({
      ev: event
    });

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



}
