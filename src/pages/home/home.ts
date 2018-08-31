import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, PopoverController, Slides } from 'ionic-angular';


import { HttpClient } from '@angular/common/http';

import { CategoryProvider } from '../../providers/category/category';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { AddwalletPage } from '../addwallet/addwallet';

import { NotificationsPage } from '../notifications/notifications';
import { BillsPage } from '../bills/bills';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('slider') slider: Slides;
  page:string = "0";
  wallets: any;
  expenses: any = [];
  expense: any;
  userData: any;
  data: any;
  x: any;

  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  n = new Date();
  m = this.month[this.n.getMonth()];
  y = this.n.getFullYear();
  period = this.m + " " + this.y;

  constructor(private popCtrl: PopoverController, private toastCtrl: ToastController, public navParams: NavParams, public navCtrl: NavController, public http: HttpClient, public categoryProvider: CategoryProvider) {
    this.getWallets();
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

  viewTransactions(id) {
    console.log(id);
    this.navCtrl.push(ViewtransactionsPage, { _id: id });
  }

  addCategory() {
    this.navCtrl.push(AddwalletPage);
  }

  selectedTab(index) {
    this.slider.slideTo(index);
  }

  isChanged($event) {
    this.page = $event._snapIndex.toString();
  }

  goToBills() {
    this.navCtrl.setRoot(BillsPage);
  }

}
