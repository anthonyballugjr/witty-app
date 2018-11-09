import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { PopovermenuComponent } from '../../components/popovermenu/popovermenu';
import { SuperTabs } from 'ionic2-super-tabs';

import { HomePage } from '../home/home';
import { ChallengesPage } from '../challenges/challenges';
import { BudgetOverviewPage } from '../budget-overview/budget-overview';
import { ExpensesPage } from '../expenses/expenses';

import { CategoryProvider } from '../../providers/category/category';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  expenses: any = [];
  wallets: any;

  pages = [
    {
      pageName: HomePage, title: 'My Wallets', icon: 'home', id: 'homeTab'
    },
    {
      pageName: ChallengesPage, title: 'Saving Challenge', icon: 'trophy', id: 'challengesTab'
    },
    {
      pageName: BudgetOverviewPage, title: 'Budget Summary', icon: 'paper', id: 'overviewTab'
    }
  ];

  superSelectedTab = 0;
  @ViewChild(SuperTabs) superTabs: SuperTabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private popCtrl: PopoverController, public categoryProvider: CategoryProvider) {
    this.getWallets();
  }

  ionViewDidLoad() {
    this.expenses = []
  }

  getWallets() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        for (let i of this.wallets) {
          for (let x of i.transactions) {

            this.expenses.push({ _id: x._id, desc: x.desc, amount: x.amount, date: x.date });
          }
        }
        console.log('Expenses', this.expenses);
      });
  }

  onTabSelect(ev: any) {
    this.superSelectedTab = ev.index;
  }

  //home page popover
  showExpenses(myEvent) {
    let pop = this.popCtrl.create(ExpensesPage, { expenses: this.expenses });
    pop.present({
      ev: myEvent
    });
  }

  //budget-overview page popover
  showPopover(event) {
    let pop = this.popCtrl.create(PopovermenuComponent, { menu: 'overview' });
    pop.present({
      ev: event
    });
  }

}
