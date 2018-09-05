import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, ToastController, PopoverController, ModalController, Slides } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { HttpClient } from '@angular/common/http';

import { CategoryProvider } from '../../providers/category/category';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { BillsPage } from '../bills/bills';
import { PopHomePage } from '../pop-home/pop-home';
import { ExpensesPage } from '../expenses/expenses';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('slider') slider: Slides;
  page: string = "0";
  wallets: any;
  expenses: any = [];
  totalExp: any = [];
  userData: any;
  data: any;
  x: any;

  calendars = [];

  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  n = new Date();
  m = this.month[this.n.getMonth()];
  y = this.n.getFullYear();
  period = this.m + " " + this.y;

  constructor(private modalCtrl: ModalController, private plt: Platform, private calendar: Calendar, private popCtrl: PopoverController, private toastCtrl: ToastController, public navParams: NavParams, public navCtrl: NavController, public http: HttpClient, public categoryProvider: CategoryProvider) {
    this.getWallets();
  }

  ionViewDidLoad() {
    this.getWallets();
    this.plt.ready().then(() => {
      this.calendar.listCalendars().then(data => {
        this.calendars = data;
      });
    })
  }

  addEvent(cal) {
    let date = new Date();
    let options = { calendarId: cal.id, calendarName: cal.name, recurrence: 'monthly', firstReminderMinutes: 15 };

    this.calendar.createEventInteractivelyWithOptions('Bill name', '', 'Special Notes', date, date, options).then(res => {
    }, err => {
      console.log('err: ', err);
    });
  }

  openCalendar(cal) {
    let modal = this.modalCtrl.create(BillsPage, { name: cal.name });
    modal.present();

    modal.onDidDismiss(result => {
      this.ionViewDidLoad();
    });
  }

  showPopover(myEvent) {
    let pop = this.popCtrl.create(ExpensesPage, {expenses: this.expenses});
    pop.present({
      ev: myEvent
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Hello, ' + localStorage.nickname,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: false
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  getWallets() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        for (let i of this.wallets) {
          for (let x of i.transactions) {
            this.expenses.push(x);
          }
        }
        console.log(this.wallets);
        console.log(this.expenses);
      });
  }

  viewTransactions(id) {
    let modal = this.modalCtrl.create(ViewtransactionsPage, { _id: id });
    modal.present();

    modal.onDidDismiss((result) => {
      this.ionViewDidLoad();
    });
  }

  selectedTab(index) {
    this.slider.slideTo(index);
  }

  isChanged($event) {
    this.page = $event._snapIndex.toString();
  }

  goToBills() {
    this.navCtrl.push(BillsPage);
  }

}
