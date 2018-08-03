import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { CategoryProvider } from '../../providers/category/category';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';

/**
 * Generated class for the AddwalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addwallet',
  templateUrl: 'addwallet.html',
})
export class AddwalletPage {
  category = {
    'name': '',
    'budget': '',
    'active': 'true'
  }

  constructor(public loadCtrl: LoadingController, private formBldr: FormBuilder, public alertCtrl: AlertController, public navCtrl: NavController, public categoryProvider: CategoryProvider, public navParams: NavParams) {
  }

  private addWalletForm = this.formBldr.group({
    name: ["", Validators.required],
    budget: ["", Validators.required]
  });

  addCategory() {
    this.categoryProvider.addCategory(this.category).then((result) => {
      console.log(result);
      this.navCtrl.setRoot(HomePage);
    }, (err) => {
      console.log(err);
    });
    this.success();
  }

  presentLoading() {
    const loader = this.loadCtrl.create({
      spinner: 'bubbles',
      content: 'Creating new wallet...'
    });
    loader.present();
    setTimeout(() => {
      this.addCategory();
      loader.dismiss();
    }, 3000);
  }

  success() {
    const success = this.alertCtrl.create({
      title: 'New Wallet',
      message: this.category.name.toUpperCase() + ' added as a new wallet!',
      buttons: ['Ok']
    });
    success.present();
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Create new wallet',
      message: 'Add ' + this.category.name.toUpperCase() + ' as a new wallet?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.presentLoading();
            console.log('Adding new wallet');
          }
        }
      ]
    });
    confirm.present();
  }


}
