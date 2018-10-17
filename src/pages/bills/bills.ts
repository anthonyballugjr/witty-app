import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, AlertController, LoadingController, ToastController, Platform } from 'ionic-angular';
import { Categories } from '../../data/data';

@IonicPage()
@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html',
})
export class BillsPage {
  categories = Categories;

  calName = "";
  events = [];
  alert: any;
  print: any;

  period: any;

  loading: any;
  toast: any;

  constructor(private viewCtrl: ViewController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private plt: Platform, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.calName = navParams.get('name');
  }

  ionViewDidLoad() {

  }

  sendCategory(id) {
    this.viewCtrl.dismiss(id);
  }


  presentLoading(content) {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: content
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

