import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { CategoryProvider } from '../../providers/category/category';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Categories } from '../../data/data';

@IonicPage()
@Component({
  selector: 'page-addwallet',
  templateUrl: 'addwallet.html',
})
export class AddwalletPage {
  @ViewChild('amount') myInput;
  loading: any;
  alert: any;

  type: any;
  isSavings: boolean = false;
  doNotify: boolean = false;

  categories = Categories;

  wallet = {
    'name': '',
    'userId': localStorage.userId,
    'type': '',
    'amount': '',
    'categoryId': '',
    'period': localStorage.period
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

  cancel() {
    this.viewCtrl.dismiss();
  }

  addWallet() {
    if (parseInt(this.wallet.amount) < 100) {
      this.showAlert('Minimum allowable amount is 100.')
      this.myInput.setFocus();
    }
    else if (this.isSavings === false && this.wallet.categoryId === '') {
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
                    trigger: { at: date, firstAt: date },
                    foreground: true,
                    launch: true,
                    every: this.notifData.every !== '' ? this.notifData.every : 0,
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
