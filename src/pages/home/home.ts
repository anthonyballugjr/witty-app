import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, Slides, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { CategoryProvider } from '../../providers/category/category';
import { SavingsProvider } from '../../providers/savings/savings';
import { ExpensesProvider } from '../../providers/expenses/expenses';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { BillsPage } from '../bills/bills';
import { AddwalletPage } from '../addwallet/addwallet';
import { ViewDepositsPage } from '../view-deposits/view-deposits';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('slider') slider: Slides;
  page: string = "0";
  period = localStorage.period;

  sWallets: any;
  eWallets: any;
  monthDeposits: any;

  isSavings: boolean = false;

  loading: any;
  alert: any;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private toastCtrl: ToastController, public navParams: NavParams, public navCtrl: NavController, public http: HttpClient, public expensesProvider: ExpensesProvider, public savingsProvider: SavingsProvider) {
    this.check();
    this.getExpenseWallets();
    this.getSavingsWallets();
  }

  addSavings() {
    console.log('Aloha!!')
  }

  presentAlert(title, msg) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  presentLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg,
      spinner: 'bubbles'
    });
    this.loading.present();
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

  getExpenseWallets() {
    this.expensesProvider.getWallets(localStorage.period)
      .then(data => {
        this.eWallets = data;
        console.log('Expense Wallets', this.eWallets);
      });
  }

  getSavingsWallets() {
    this.savingsProvider.getWallets()
      .then(data => {
        this.sWallets = data;
        var total = 0;
        for(let s of this.sWallets){
          for(let x of s.deposits){
            if(x.period === localStorage.period){
              total += x.amount;
            }
          }
        }
        this.monthDeposits = total;
        console.log(`This month's deposits,${this.monthDeposits}`)
        console.log('Savings Wallets', this.sWallets);
      });
  }

  viewTransactions(id, name, wallet) {
    let modal = this.modalCtrl.create(ViewtransactionsPage, { _id: id, walletName: name, wallet: wallet });
    modal.onDidDismiss(() => {
      this.getExpenseWallets();
      this.getSavingsWallets();
    });

    modal.present();
  }

  viewDeposits(id, name) {
    let modal = this.modalCtrl.create(ViewDepositsPage, { _id: id, walletName: name });

    modal.onDidDismiss(() => {
      this.getExpenseWallets();
      this.getSavingsWallets();
    });
    modal.present();
  }

  addWallet() {
    let modal = this.modalCtrl.create(AddwalletPage, { isSavings: this.isSavings });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        console.log(data);
        this.presentLoading('Creating new wallet...');
        this.expensesProvider.addWallet(data)
          .then(result => {
            console.log(result);
            this.loading.dismiss();
            this.presentAlert('Success!', 'New Expense wallet created');
            this.getExpenseWallets();
          }, err => {
            this.loading.dismiss();
            console.log(err);
            this.presentAlert('Failed', err.error);
          });
      }
      this.getExpenseWallets();
      this.getSavingsWallets();
    });
  }

  selectedTab(index) {
    this.slider.slideTo(index);
  }

  isChanged($event) {
    this.page = $event._snapIndex.toString();
    this.check();
  }

  willChange($event) {
    this.page = $event._snapIndex.toString();
  }

  check() {
    if (this.page === '0') {
      this.isSavings = false
    } else {
      this.isSavings = true;
    }
  }

  goToBills() {
    this.navCtrl.push(BillsPage);
  }

}
