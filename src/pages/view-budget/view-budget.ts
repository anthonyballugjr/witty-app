import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { SavingsProvider } from '../../providers/savings/savings';

@IonicPage()
@Component({
  selector: 'page-view-budget',
  templateUrl: 'view-budget.html',
})
export class ViewBudgetPage {
  period: any;
  eWallets: any;
  sWallets: any;
  sDeposits: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public expensesProvider: ExpensesProvider, public savingsProvider: SavingsProvider, private viewCtrl: ViewController) {
    this.period = this.navParams.get('period');
    this.getEwallets();
    this.getSwallets();
    console.log(this.period);
  }

  close(){
    this.viewCtrl.dismiss();
  }

  getEwallets() {
    this.expensesProvider.getWallets(this.period)
      .then(data => {
        this.eWallets = data;
        console.log('Wallets', this.eWallets);
      }, err => {
        console.log(err);
      });
  }

  getSwallets() {
    this.savingsProvider.getWallets()
      .then(data => {
        this.sWallets = data;
        var total = 0;
        for (let a of this.sWallets) {
          for (let b of a.deposits) {
            if (b.period === this.period) {
              total += b.amount
            }
          }
        }
        this.sDeposits = total;
        console.log('Deposits', this.sDeposits);
      }, err => {
        console.log(err);
      });
  }

}
