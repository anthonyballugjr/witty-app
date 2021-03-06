import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { nPeriod } from '../../data/period';


@IonicPage()
@Component({
  selector: 'page-prediction',
  templateUrl: 'prediction.html',
})
export class PredictionPage {
  @ViewChild('chartCanvas') chartCanvas
  eWallets: any;
  amounts: any = [];
  names: any = [];
  doughnutChart: any;
  period = localStorage.period;
  predicted: any = [];
  x: any;
  y: any = [];
  nPeriod = nPeriod;

  newNames: any = [];
  newAmounts: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public expensesProvider: ExpensesProvider, private loadCtrl: LoadingController, private viewCtrl: ViewController) {
    this.doAll();
  }

  async doAll() {
    await this.getExpenseWallets();
    // await this.predict();
  }

  closeView() {
    this.viewCtrl.dismiss();
  }

  getExpenseWallets() {
    this.expensesProvider.getWallets(localStorage.period)
      .then(data => {
        this.eWallets = data;
        for (let x of this.eWallets) {
          this.amounts.push(x.amount);
          this.names.push(x.name);
        }
        console.log('Amounts', this.amounts);
        console.log('Names', this.names);
      })
      .then(() => {
        this.names.forEach(name => {
          this.expensesProvider.suggest(name)
            .then(data => {
              this.x = data;
              this.y = this.x.x;
              for (let wallet of this.y) {
                if (wallet !== null) {
                  this.predicted.push(wallet);
                }
              }
            }, err => {
              console.log(err);
            });
        });
        console.log('Predicted', this.predicted);
      });
  }

  async predict() {
    let loading = this.loadCtrl.create({
      spinner: 'hide',
      content: `<div>
      <div class="loader"><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>Predicting Values...</p>
      </div>`
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);

    await this.names.forEach(name => {
      this.expensesProvider.suggest(name)
        .then(data => {
          this.x = data;
          this.y = this.x.x;
          for (let wallet of this.y) {
            if (wallet !== null) {
              this.predicted.push(wallet);
              for (let x of this.predicted) {
                this.newNames.push(x.name);
                this.newAmounts.push(x.amount);
              }
            }
          }
        }, err => {
          console.log(err);
        });
    });
    // loading.dismiss()
    console.log('Predicted Data', this.predicted);
  }
  
}

