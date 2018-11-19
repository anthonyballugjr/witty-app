import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { BGColor, HoverColor } from '../../data/data'
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public expensesProvider: ExpensesProvider, private loadCtrl: LoadingController) {
    this.doAll();
  }

  async doAll() {
    await this.getExpenseWallets();
    // await this.predict();
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
          this.expensesProvider.predict(name)
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
        console.log('Predicted',this.predicted);
      });
  }

  async predict() {
    let loading = this.loadCtrl.create({
      spinner: 'hide',
      content: `<div>
      <div><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
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
            }
          }
        }, err => {
          console.log(err);
        });
    });
    // loading.dismiss()
    console.log('Predicted Data', this.predicted);
  }

  chart() {
    this.doughnutChart = new Chart(this.chartCanvas.nativeElement, {

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

