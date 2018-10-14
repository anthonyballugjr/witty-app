import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Chart } from 'chart.js';
import { CategoryProvider } from '../../providers/category/category';
import { ReportsProvider } from '../../providers/reports/reports';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BGColor, HoverColor } from '../../data/data';

@IonicPage()
@Component({
  selector: 'page-mywallets',
  templateUrl: 'mywallets.html'
})

export class MywalletsPage {
  @ViewChild('doughnutCanvas') doughnutCanvas;

  transactions: any = [];
  categories: any;
  wallets: any;
  x: any[] = [];
  next: any = [];
  nextD: any;
  budgetOverview: any = [];
  period = localStorage.period;

  doughnutChart: any;

  names: any = [];
  amounts: any[] = [];

  xyz: any;
  def: any = [];

  predictData: any = [];

  notifData: any;

  constructor(public reportsProvider: ReportsProvider, private plt: Platform, private localNotif: LocalNotifications, private alertCtrl: AlertController, public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getWallets();
    this.getCurrentBudgetOverview();

    // this.plt.ready().then((readySource) => {
    //   this.localNotif.getAllScheduled().then(data => {
    //     this.notifData = data;
    //     this.notifJson = JSON.parse(this.notifData);
    //     console.log(data);
    //     console.log(this.notifJson.data);
    //   });
    //   this.localNotif.on('click').subscribe(data => {
    //     let json = JSON.parse(data.data);

    //     let alert = alertCtrl.create({
    //       title: data.title,
    //       subTitle: json.notifData
    //     });
    //     alert.present();
    //   })
    // });
  }

  ionViewDidLoad() {
    console.log('Play! Play! Play!');
  }

  selectChange(e) {
    console.log(e);
  }

  chart() {
    Chart.defaults.global.legend.position = 'bottom';
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: this.names,
        datasets: [{
          label: 'Wallet name',
          data: this.amounts,
          backgroundColor: BGColor,
          hoverBackgroundColor: HoverColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: this.period + " Wallets"
        },
        animation: {
          animateScale: true
        }
      }
    });
  }

  getCurrentBudgetOverview() {
    this.reportsProvider.getCurrentBudgetOverview()
      .then(data => {
        this.budgetOverview = data;
        console.log(this.budgetOverview);
      }, err => {
        console.log(err);
      });
  }

  getNext() {
    this.categoryProvider.getNext()
      .then(data => {
        this.nextD = data;
        this.next = this.nextD.next;
        console.log(this.next);
      }, err => {
        console.log(err);
      });
  }

  predict() {
    this.names.forEach(name => {
      this.reportsProvider.predict(name)
        .then(data => {
          console.log(data);
          this.xyz = data;
          this.def = this.xyz.x;
          for (let abc of this.def) {
            if (abc !== null) {
              this.predictData.push({ name: abc.wallet, oldAmount: abc.oldAmount, predictedAmount: abc.predictedAmount })
            }
          }
        }, err => {
          console.log(err);
        });
    })
    console.log(this.predictData);
  }

  getWallets() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        for (let x of this.wallets) {
          this.x.push({ name: x.name, amount: x.amount });
          this.names.push(x.name);
          this.amounts.push(x.amount);
        }
        this.chart();
        console.log(this.x);
        console.log('names', this.names);
        console.log('amounts', this.amounts);
        console.log(data);
      });
  }

}
