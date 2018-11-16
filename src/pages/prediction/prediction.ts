import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { BGColor, HoverColor } from '../../data/data'
import { ExpensesProvider } from '../../providers/expenses/expenses';


@IonicPage()
@Component({
  selector: 'page-prediction',
  templateUrl: 'prediction.html',
})
export class PredictionPage {
  @ViewChild('doughnutCanvas') doughnutCanvas
  eWallets: any;
  amounts: any = [];
  names: any = [];
  doughnutChart: any;
  period = localStorage.period;
  predicted: any = [];
  x: any;
  y: any = [];

  newNames: any = [];
  newAmounts: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public expensesProvider: ExpensesProvider, private loadCtrl: LoadingController) {
    this.doAll();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PredictionPage');
  }

  async doAll(){
    await this.getExpenseWallets();
    await this.predict();
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
        this.chart();
      });
  }

  predict() {
    let loading = this.loadCtrl.create({
      content: 'Predicting values...'
    });
    loading.present();

    this.names.forEach(name => {
      this.expensesProvider.predict(name)
        .then(data => {
          this.x = data;
          this.y = this.x.x;
          for (let wallet of this.y) {
            if (wallet !== null) {
              this.predicted.push(wallet);
            }
          }
          console.log(this.predicted);
        })
        .then(() => {
          for (let x of this.predicted) {
            this.newAmounts.push(x.amount);
            this.newNames.push(x.name);
          }
          console.log('newA', this.newAmounts);
          console.log('newN', this.newNames);
        })
        .then(() => {
          this.chart();
        }, err => {
          console.log(err);
        });
    });
    loading.dismiss()
    console.log('Predicted Data', this.predicted);
  }

  chart() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: this.newNames,
        datasets: [
          {
            label: 'wallet amount',
            data: this.newAmounts,
            backgroundColor: BGColor,
            hoverBackgroundColor: HoverColor
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: `${this.period} Prediction`,
          display: true,
        },
        animation: {
          animateScale: true
        },
        legend: {
          display: true,
          boxWidth: 20,
          position: 'bottom',
        }
      }
    });
  }
}

