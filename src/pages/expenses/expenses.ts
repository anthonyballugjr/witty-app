import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage {
  expenses: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.expenses = this.navParams.get('expenses');
  }

  ionViewDidLoad() {
    
  }

}
