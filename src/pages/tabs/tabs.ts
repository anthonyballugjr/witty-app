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

  pages = [
    {
      pageName: HomePage, title: 'My Wallets', icon: 'home', id: 'homeTab'
    },
    {
      pageName: ChallengesPage, title: 'Saving Challenges', icon: 'trophy', id: 'challengesTab'
    },
    {
      pageName: BudgetOverviewPage, title: 'Budget Summary', icon: 'paper', id: 'overviewTab'
    }
  ];

  superSelectedTab = 0;
  @ViewChild(SuperTabs) superTabs: SuperTabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private popCtrl: PopoverController, public expensesProvider: ExpensesProvider, private menuCtrl: MenuController) {
    this.getExpenseWallets();
  }

  ionViewDidLoad() {
    this.expenses = []
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  getExpenseWallets() {
    this.expensesProvider.getWallets(localStorage.period)
      .then(data => {
        this.wallets = data;
        var today = moment().format('MMMM DD, YYYY - dddd');
        console.log('Today', today);
        for (let i of this.wallets) {
          for (let x of i.transactions) {
            this.expenses.push
              ({
                _id: x._id, desc: x.desc, amount: x.amount, date: today === x.date ? 'Today' : x.date
              });
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

  //budget-overview page
  showPopover(event) {
    let pop = this.popCtrl.create(PopovermenuComponent, { menu: 'overview' });
    pop.present({
      ev: event
    });
  }

}
