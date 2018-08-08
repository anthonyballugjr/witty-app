import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
  expenses: any[];
  userData: any;

  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  n = new Date();
  m = this.month[this.n.getMonth()];
  y = this.n.getFullYear();
  period = this.m + " " + this.y;

  constructor(public navParams: NavParams, public navCtrl: NavController, public http: HttpClient, public categoryProvider: CategoryProvider) {
    this.getCategories();
    this.userData = this.navParams.get('userData')
    console.log(this.userData);
  }

  getCategories() {
    this.categoryProvider.getCategories()
      .then(data => {
        this.categories = data;
        console.log(this.categories);
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
