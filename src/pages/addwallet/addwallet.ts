import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { CategoryProvider } from '../../providers/category/category';
import { LocalNotifications } from '@ionic-native/local-notifications';


@IonicPage()
@Component({
  selector: 'page-addwallet',
  templateUrl: 'addwallet.html',
})
export class AddwalletPage {
  loading: any;
  alert: any;

  type: any;
  isSavings: boolean = false;
  doNotify: boolean = false;


  categories: any;

  month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  n = new Date();
  m = this.month[this.n.getMonth()];
  y = this.n.getFullYear();
  period = this.m + " " + this.y;

  wallet = {
    'name': '',
    'userId': localStorage.userId,
    'type': '',
    'amount': '',
    'categoryId': '',
    'period': this.period
  }

  notifData = {
    description: '',
    date: '',
    time: '',
    every: ''
  }

  constructor(public localNotifaction: LocalNotifications, private viewCtrl: ViewController, public loadCtrl: LoadingController, private formBldr: FormBuilder, public alertCtrl: AlertController, public navCtrl: NavController, public categoryProvider: CategoryProvider, public navParams: NavParams) {
    this.isSavings = this.navParams.get('isSavings');
    if (this.isSavings === true) {
      this.wallet.type = 'savings'
    } else {
      this.wallet.type = 'expense'
    }
    console.log('type: ', this.wallet.type)
    console.log('is it savings? ', this.isSavings);
    console.log(this.period);
    this.getCategories();
  }

  private addWalletForm = this.formBldr.group({
    name: ["", Validators.required],
    budget: ["", Validators.required],
    categoryId: [""],
    doNotify: [""],
    date: [""],
    time: [""],
    every: [""],
    description: [""],
  });

  showAlert(msg) {
    this.alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  showMe() {
    console.log(this.doNotify);
  }

  saveNotification() {
    this.localNotifaction.schedule({
      title: 'oh yeah',
      text: 'Notification',
    })
  }

  getCategories() {
    this.categoryProvider.getCategories()
      .then(data => {
        this.categories = data;
        console.log(this.categories);
      });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  addWallet() {
    if (this.isSavings === false && this.wallet.categoryId === '') {
      this.showAlert('Select a category')
    }
    else if (this.doNotify === true && (this.notifData.date === '' || this.notifData.time === '')) {
      this.showAlert('Notification details not set!')
    }
    else {
      const confirm = this.alertCtrl.create({
        title: 'New Wallet',
        message: 'Add new wallet?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('cancelled');
            }
          },
          {
            text: 'Agree',
            handler: () => {
              if (this.wallet.categoryId === 'bll') {
                if (this.doNotify === true) {

                  console.log(this.wallet);
                  console.log(this.notifData);

                  var date = new Date(this.notifData.date + " " + this.notifData.time);

                  this.localNotifaction.schedule({
                    title: this.wallet.name,
                    text: this.notifData.description,
                    led: 'FF0000',
                    trigger: { at: date },
                    foreground: true,
                    launch: true,
                    every: this.notifData.every !== '' ? this.notifData.every : '',
                    data: { notifData: this.notifData }
                  });
                  this.viewCtrl.dismiss(this.wallet);
                } else {
                  console.log(this.wallet);
                  this.viewCtrl.dismiss(this.wallet);
                }
              } else {
                console.log(this.wallet);
                this.viewCtrl.dismiss(this.wallet);
              }
            }
          }
        ]
      });
      confirm.present();
    }
  }

}
