import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { CategoryProvider } from '../../providers/category/category';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { AddwalletPage } from '../addwallet/addwallet';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  wallets: any;
  expenses: any;
  expense: any;
  userData: any;
  data: any;

  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  n = new Date();
  m = this.month[this.n.getMonth()];
  y = this.n.getFullYear();
  period = this.m + " " + this.y;

  constructor(private toastCtrl: ToastController, public navParams: NavParams, public navCtrl: NavController, public http: HttpClient, public categoryProvider: CategoryProvider) {
    this.getWallets();
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
        this.expense = this.expenses
        console.log(this.wallets);
      });
  }

  viewTransactions(data) {
    this.navCtrl.setRoot(ViewtransactionsPage, { data: data });
  }

  addCategory() {
    this.navCtrl.push(AddwalletPage);
  }

}
