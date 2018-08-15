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
  categories: any;
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
    this.getCategories();
    this.userData = JSON.parse(localStorage.userData);
    //console.log(this.userData);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Hello, ' + this.userData.email,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: false
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  getCategories() {
    this.categoryProvider.getCategories()
      .then(data => {
        this.categories = data;
        this.expense = this.expenses
        console.log(this.categories);
        console.log(this.expenses);
        console.log(this.expense);
      });
  }

  viewTransactions(data) {
    this.navCtrl.push(ViewtransactionsPage, { data: data });
    console.log(data);
  }

  addCategory() {
    this.navCtrl.push(AddwalletPage);
  }

}
