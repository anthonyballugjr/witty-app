import { Component, ViewChild } from '@angular/core';

import { NavController, NavParams, ToastController, PopoverController } from 'ionic-angular';
import { SuperTabs } from 'ionic2-super-tabs';

import { HttpClient } from '@angular/common/http';

import { CategoryProvider } from '../../providers/category/category';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { AddwalletPage } from '../addwallet/addwallet';

import { NotificationsPage } from '../notifications/notifications';
import { BillsPage } from '../bills/bills';
import { IonicPage } from '../../../node_modules/ionic-angular/navigation/ionic-page';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pages = [
    { pageName: 'WalletsPage', title: 'Home', icon: 'home', id: 'walletsTab' },
    { pageName: 'ChallengesPage', title: 'Saving Challenges', icon: 'trophy', id: 'savingChallengesTab' },
    { pageName: 'OverviewPage', title: 'Overview', icon: 'paper', id: 'overviewPage' }
  ];

  superSelectedTab = 0;

  @ViewChild(SuperTabs) superTabs: SuperTabs;
  wallets: any;
  expenses: any;
  expense: any;
  userData: any;
  data: any;
  counter: any = [];
  x:any;

  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  n = new Date();
  m = this.month[this.n.getMonth()];
  y = this.n.getFullYear();
  period = this.m + " " + this.y;


  constructor(private popCtrl: PopoverController, private toastCtrl: ToastController, public navParams: NavParams, public navCtrl: NavController, public http: HttpClient, public categoryProvider: CategoryProvider) {
    
  }

  showPopover(myEvent) {
    let pop = this.popCtrl.create(NotificationsPage);
    pop.present({
      ev: myEvent
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Hello, ' + localStorage.nickname,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: false
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  onTabSelect(ev: any) {
    this.superSelectedTab = ev.index;
  }

}
