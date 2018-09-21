import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { PopovermenuComponent } from '../../components/popovermenu/popovermenu';
import { SuperTabs } from 'ionic2-super-tabs';

import { HomePage } from '../home/home';
import { ChallengesPage } from '../challenges/challenges';
import { BudgetOverviewPage} from '../budget-overview/budget-overview';
import { ExpensesPage } from '../expenses/expenses';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  expenses: any = [];
  
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

  displayWalletButton = true;

  superSelectedTab = 0;
  @ViewChild(SuperTabs) superTabs: SuperTabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private popCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  onTabSelect(ev: any) {
    this.superSelectedTab = ev.index;

    if(ev.index === 2){
      this.displayWalletButton = false;
    }
    else
      this.displayWalletButton = true;
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
