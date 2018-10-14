import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, Slides, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { CategoryProvider } from '../../providers/category/category';
import { ViewtransactionsPage } from '../viewtransactions/viewtransactions';
import { BillsPage } from '../bills/bills';
import { AddwalletPage } from '../addwallet/addwallet';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('slider') slider: Slides;
  page: string = "0";

  wallets: any;
  totalExp: any = [];
  userData: any;
  data: any;
  x: any;

  calendars = [];

  period = localStorage.period;

  isSavings: boolean = false;

  loading: any;
  alert: any;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private toastCtrl: ToastController, public navParams: NavParams, public navCtrl: NavController, public http: HttpClient, public categoryProvider: CategoryProvider) {
    this.check();
    this.getWallets();
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

  getWallets() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        console.log(this.wallets);
      });
  }

  viewTransactions(id, name) {
    let modal = this.modalCtrl.create(ViewtransactionsPage, { _id: id, walletName: name });
    modal.present();

    modal.onDidDismiss(() => {
      this.getWallets();
    });
  }

  addWallet() {
    let modal = this.modalCtrl.create(AddwalletPage, { isSavings: this.isSavings });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        console.log(data);
        this.presentLoading('Creating new wallet...');
        this.categoryProvider.addWallet(data)
          .then(result => {
            console.log(result);
            this.loading.dismiss();
            this.presentAlert('Success!', 'New ' + data.type + ' wallet created');
            this.getWallets();
          }, err => {
            this.loading.dismiss();
            console.log(err);
            this.presentAlert('Failed', err.error);
          });
      }
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
