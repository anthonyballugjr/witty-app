import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { CategoryProvider } from '../../providers/category/category';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { AddwalletPage } from '../addwallet/addwallet';
import { BillsPage } from '../bills/bills';

@IonicPage()
@Component({
  selector: 'page-wallets',
  templateUrl: 'wallets.html',
})
export class WalletsPage {
  rootNavCtrl: NavController;

  wallets: any;
  expenses: any;
  expense: any;
  userData: any;
  data: any;
  counter: any = [];
  x:any;

  page = 0;

  @ViewChild('slider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public categoryProvider: CategoryProvider) {
    this.getWallets();
    this.rootNavCtrl = this.navParams.get('rootNavCtrl');
  }

  selectedTab(index){
    this.slider.slideTo(index);
  }
  
  isChanged($event){
    this.page = $event._snapIndex.toString();
  }

  getWallets() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        for (let i of this.wallets) {
          for (let x of i.transactions) {
            this.counter.push(x);
          }
        }
        this.expense = this.expenses
        console.log(this.wallets);
        console.log(this.counter);
      });
  }

  viewTransactions(data) {
    this.rootNavCtrl.push(ViewtransactionsPage, { data: data });
  }

  addCategory() {
    this.rootNavCtrl.push(AddwalletPage);
  }

  goToBills(){
    this.rootNavCtrl.setRoot(BillsPage);
  }

}
