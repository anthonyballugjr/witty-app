import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, MenuController } from 'ionic-angular';
import { PopovermenuComponent } from '../../components/popovermenu/popovermenu';
import { SuperTabs } from 'ionic2-super-tabs';
import moment from 'moment';

import { HomePage } from '../home/home';
import { ChallengesPage } from '../challenges/challenges';
import { BudgetOverviewPage } from '../budget-overview/budget-overview';
import { ExpensesPage } from '../expenses/expenses';

import { ExpensesProvider } from '../../providers/expenses/expenses';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  expenses: any = [];
  wallets: any;
  names: any = [];
  amounts: any = [];

  pages = [
    { pageName: HomePage, title: 'My Wallets', icon: 'home', id: 'homeTab' },
    { pageName: ChallengesPage, title: 'Saving Challenge', icon: 'trophy', id: 'challengesTab' },
    { pageName: BudgetOverviewPage, title: 'Budget Summary', icon: 'paper', id: 'overviewTab' }
  ];

  superSelectedTab = 0;
  @ViewChild(SuperTabs) superTabs: SuperTabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private popCtrl: PopoverController, public expensesProvider: ExpensesProvider, private menuCtrl: MenuController) {
    this.doAll();
  }

  async doAll() {
    await this.getExpenseWallets();
  }

  ionViewDidLoad() {
    this.expenses = []
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
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

  getExpenseWallets() {
    this.expensesProvider.getWallets(localStorage.period)
      .then(data => {
        this.wallets = data;
        this.wallets.forEach(wallet => {
          for (let i of wallet['transactions']) {
            this.expenses.push(i);
          }
        })
      });
  }
}
