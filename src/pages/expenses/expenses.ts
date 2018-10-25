import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html',
})
export class ExpensesPage {
  expenses: any;

  today = new Date().getDay;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.expenses = this.navParams.get('expenses');
    console.log('Expenses',this.expenses);
  }
 
}
