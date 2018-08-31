import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';

import { HomePage } from '../home/home';
import { ChallengesPage } from '../challenges/challenges';
import { BudgetOverviewPage} from '../budget-overview/budget-overview';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  // tab1Root = HomePage;
  // tab2Root = ChallengesPage;

  pages = [
    {
      pageName: HomePage, title: 'Home', icon: 'home', id: 'homeTab'
    },
    {
      pageName: ChallengesPage, title: 'Saving Challenges', icon: 'trophy', id: 'challengesTab'
    },
    {
      pageName: BudgetOverviewPage, title: 'Overview', icon: 'paper', id: 'overviewTab'
    }
  ];

  superSelectedTab = 0;
  @ViewChild(SuperTabs) superTabs: SuperTabs;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  onTabSelect(ev: any) {
    this.superSelectedTab = ev.index;
  }

}
