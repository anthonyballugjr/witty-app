import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { CategoryProvider } from '../../providers/category/category';
import { SavingsProvider } from '../../providers/savings/savings';
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
  selectOptions = {
    title: 'Select a category',
    mode: 'ios',
    buttons: [this.categories]
  }

  expenseWallet = {
    'name': '',
    'userId': localStorage.userId,
    'amount': '',
    'categoryId': '',
    'period': localStorage.period
  }

  savingsWallet = {
    'name': '',
    'userId': localStorage.userId,
    'goal': '',
  }

  notifData = {
    description: '',
    date: '',
    time: '',
    every: ''
  }

  constructor(public localNotifaction: LocalNotifications, private viewCtrl: ViewController, public loadCtrl: LoadingController, private formBldr: FormBuilder, public alertCtrl: AlertController, public navCtrl: NavController, public categoryProvider: CategoryProvider, public navParams: NavParams, public savingsProvider: SavingsProvider) {
    this.isSavings = this.navParams.get('isSavings');
    console.log('Is it savings?',this.isSavings);
  }

  private addExpenseForm = this.formBldr.group({
    name: ["", Validators.required],
    budget: ["", Validators.required],
    categoryId: [""],
    doNotify: [""],
    date: [""],
    time: [""],
    every: [""],
    description: [""],
  });

  private addSavingsForm = this.formBldr.group({
    name: ["", Validators.required],
    goal: ["", Validators.required]
  })

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

  presentAlert(title, sub) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: sub,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  addExpenseWallet() {
    if (parseInt(this.expenseWallet.amount) < 100) {
      this.showAlert('Minimum allowable amount is 100.')
      this.myInput.setFocus();
    }
    else if (this.expenseWallet.categoryId === '') {
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
              if (this.expenseWallet.categoryId === 'bll') {
                if (this.doNotify === true) {

                  console.log(this.expenseWallet);
                  console.log(this.notifData);

                  var date = new Date(this.notifData.date + " " + this.notifData.time);

                  this.localNotifaction.schedule({
                    title: this.expenseWallet.name,
                    text: this.notifData.description,
                    led: 'FF0000',
                    trigger: { at: date, firstAt: date },
                    foreground: true,
                    launch: true,
                    every: this.notifData.every !== '' ? this.notifData.every : 0,
                    data: { notifData: this.notifData }
                  });
                  this.viewCtrl.dismiss(this.expenseWallet, 'expense');
                } else {
                  console.log(this.expenseWallet);
                  this.viewCtrl.dismiss(this.expenseWallet, 'expense');
                }
              } else {
                console.log(this.expenseWallet);
                this.viewCtrl.dismiss(this.expenseWallet, 'expense');
              }
            }
          }
        ]
      });
      confirm.present();
    }
  }

  addSavingsWallet() {
    let alert = this.alertCtrl.create({
      title: 'New Savings Wallet',
      subTitle: 'Add new wallet?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            let loading = this.loadCtrl.create({
              content: 'Creating new wallet...'
            });
            loading.present();
            this.savingsProvider.addWallet(this.savingsWallet)
              .then(result => {
                console.log(result);
                loading.dismiss();
                this.presentAlert('Success!', 'New Savings wallet created');
                this.viewCtrl.dismiss();
              }, err => {
                loading.dismiss();
                this.presentAlert('Failed', err.error)
              })
          }
        }
      ]
    });
    alert.present();
  }

}
