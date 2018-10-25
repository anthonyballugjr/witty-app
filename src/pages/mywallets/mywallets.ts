import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ModalController, Slides } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
import { ReportsProvider } from '../../providers/reports/reports';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BillsPage } from '../bills/bills';
import moment from 'moment';
import { CreateBudgetPage } from '../create-budget/create-budget';

@IonicPage()
@Component({
  selector: 'page-mywallets',
  templateUrl: 'mywallets.html'
})

export class MywalletsPage {
  // @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('categoryInput') categoryInput;
  @ViewChild('slider') slider: Slides;

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
  categoryID: any;

  alert: any;

  constructor(public reportsProvider: ReportsProvider, private plt: Platform, private localNotif: LocalNotifications, private alertCtrl: AlertController, public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController) {
    this.getWallets();
    this.getCurrentBudgetOverview();

    let firstDay = moment().startOf('month').format('MM-DD-YYYY');
    let last = moment().endOf('month').format('DD');
    let ngayon = moment().format('DD');
    let diff = moment().endOf('month').fromNow();
    console.log('First Day: ', firstDay);
    console.log('last day', last, 'Ngayon', ngayon, 'Days left', diff);
    if (ngayon === last) this.presentAlert('LAST DAY NA, LETS CREATE A BUDGET!', 'ALRIGHT!!!');
    this.presentAlert('NOT YET LAST DAY!', 'Witty Wallet will create your next month budget ' + diff + ' =))');
  }

  ionViewDidLoad() {
    this.slider.lockSwipes(true);
    console.log('Play! Play! Play!');
  }

  presentAlert(title, sub) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: sub,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'Create Now',
          handler: () => {
            let modal = this.modalCtrl.create(CreateBudgetPage);
            modal.present();
          }
        }
      ]
    });
    this.alert.present();
  }

  pop(name) {
    this.alert = this.alertCtrl.create({
      title: 'Remove Wallet',
      subTitle: 'Remove this wallet from the list?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.names.pop(name);
            console.log(this.names);
          }
        }
      ]
    });
    this.alert.present();
  }

  goToSlide(slideNo) {
    this.slider.lockSwipes(false);
    this.slider.slideTo(slideNo, 700);
    this.slider.lockSwipes(true);
  }

  openCategories() {
    let modal = this.modalCtrl.create(BillsPage);
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.categoryID = data;
        this.categoryInput = this.categoryID;
      }
    })
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
        console.log('Next', this.next);
      }, err => {
        console.log(err);
      });
  }

  predict() {
    this.names.forEach(name => {
      this.reportsProvider.predict(name)
        .then(data => {
          this.xyz = data;
          this.def = this.xyz.x;
          for (let abc of this.def) {
            if (abc !== null) {
              this.predictData.push({ name: abc.wallet, oldAmount: abc.oldAmount, predictedAmount: abc.predictedAmount, amountToPredict: abc.amountToPredict, type: abc.type })
            }
          }
        }, err => {
          console.log(err);
        });
    })
    console.log('Predicted Data', this.predictData);
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
        // this.chart();
        console.log(this.x);
        console.log('names', this.names);
        console.log('amounts', this.amounts);
        console.log(data);
      });
  }

}
