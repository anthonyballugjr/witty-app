import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';

import { Categories } from '../../data/data';
import { CategoryProvider } from '../../providers/category/category';


@IonicPage()
@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html',
})
export class BillsPage {
  categories = Categories;

  alert: any;
  loading: any;
  toast: any;
  
  eWallet = {
    userId: localStorage.userId,
    name: '',
    amount: '',
    categoryId: '',
    period: ''

  }

  sWallet = {
    userId: localStorage.userId,
    name: '',
    goal: ''
  }

  constructor(private viewCtrl: ViewController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public categoryProvider: CategoryProvider) {
  }

  ionViewDidLoad() {
    console.log('Aloha');
  }

  saveExpenseWallet() {
    this.categoryProvider.saveExpenseWallet(this.eWallet)
      .then(data => {
        console.log(data);
      }, err => {
        console.log(err);
      });
  }
  saveSavingsWallet() {
    this.categoryProvider.saveSavingsWallet(this.sWallet)
      .then(data => {
        console.log(data);
      }, err => {
        console.log(err);
      });
  }

  presentLoading(content) {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<div>
      <div><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>${content}</p>
      </div>`
    });
    this.loading.present();
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      dismissOnPageChange: false
    });
    this.toast.present();
  }

  presentAlert(msg) {
    this.alert = this.alertCtrl.create({
      message: msg,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}

