import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { Chart } from 'chart.js';
import { CategoryProvider } from '../../providers/category/category';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-mywallets',
  templateUrl: 'mywallets.html',
})
export class MywalletsPage {
  @ViewChild('doughnutCanvas') doughnutCanvas;
  transactions: any = [];
  categories: any;
  ov: any = [];
  wallets: any;

  doughnutChart: any;

  names: any = [];
  amounts: any = [];

  notifData: any;
  notifJson

  constructor(private plt: Platform, private localNotif: LocalNotifications, private alertCtrl: AlertController, private calendar: Calendar, public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getWallets();
    this.getCategories();
    this.overview();

    this.plt.ready().then((readySource) => {
      this.localNotif.getAllScheduled().then(data => {
        this.notifData = data;
        this.notifJson = JSON.parse(this.notifData);
        console.log(data);
        console.log(this.notifJson.data);
      });
      this.localNotif.on('click').subscribe(data => {
        let json = JSON.parse(data.data);

        let alert = alertCtrl.create({
          title: data.title,
          subTitle: json.notifData
        });
        alert.present();
      })
    });
  }

  ionViewDidLoad() {
    this.doughnutChart = this.getDoughnutChart();
    console.log('ionViewDidLoad MywalletsPage');
  }

  showAllNotifications() {

  }

  getWallets() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        for (let x of this.wallets) {
          this.names.push(x.name);
        }
        console.log('names', this.names);
        console.log('amounts', this.amounts);
        console.log(data);
      });
  }

  getChart(context, chartType, data, options?) {
    return new Chart(context, {
      type: chartType,
      data: data,
      options: options
    });
  }

  getDoughnutChart() {
    let data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
  }

  getCategories() {
    this.categoryProvider.getCategories()
      .then(data => {
        this.categories = data;
        console.log(this.categories);
      });
  }

  overview() {
    this.categoryProvider.overview()
      .then(data => {
        this.ov = data;
        console.log(this.ov);
      });
  }

}
