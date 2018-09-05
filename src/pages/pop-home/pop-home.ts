import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { ExpensesPage } from '../expenses/expenses';
import { BudgetOverviewPage } from '../budget-overview/budget-overview';

@IonicPage()
@Component({
  selector: 'page-pop-home',
  templateUrl: 'pop-home.html',
})
export class PopHomePage {
  expenses: any = [];

  constructor(private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.expenses = this.navParams.get('expenses');
  }

  ionViewDidLoad() {
    console.log('Showing Home popover menu...');
  }

  showPage() {
    this.navCtrl.push(BudgetOverviewPage, {expenses: this.expenses});
    this.viewCtrl.dismiss();
  }

  showAnotherPage() {
    this.navCtrl.push(SignupPage).then(res => {
      this.viewCtrl.dismiss();
    });
  }

}
