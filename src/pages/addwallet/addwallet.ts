import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { CategoryProvider } from '../../providers/category/category';
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
  categories: any;
  wallet = {
    'name': '',
    'user': localStorage.userId,
    'type': '',
    'amount': '',
    'categoryId': ''
  }


  loading: any;

  constructor(public loadCtrl: LoadingController, private formBldr: FormBuilder, public alertCtrl: AlertController, public navCtrl: NavController, public categoryProvider: CategoryProvider, public navParams: NavParams) {
    this.getCategories();
  }

  private addWalletForm = this.formBldr.group({
    name: ["", Validators.required],
    budget: ["", Validators.required],
    type: ["", Validators.required],
    categoryId: [""]
  });

  getCategories(){
    this.categoryProvider.getCategories()
    .then(data=>{
      this.categories = data;
    });
  }

  // addWallet(){
  //   console.log(this.wallet);
  // }

  addWallet() {
    this.presentLoading();
    this.categoryProvider.addWallet(this.wallet).then((result) => {
      console.log(result);
      this.loading.dismiss();
      this.alert(this.wallet.name.toUpperCase() + ' added as a new wallet!');
      //this.navCtrl.pop();
      this.navCtrl.setRoot(HomePage);
    }, (err) => {
      this.loading.dismiss();
      console.log(err);
      var errorMessage = err.errors.message;
      this.alert(errorMessage);
    });
  }

  presentLoading() {
    this.loading = this.loadCtrl.create({
      spinner: 'bubbles',
      content: 'Creating new wallet...',
    });
    this.loading.present();
  }

  alert(msg) {
    const alert = this.alertCtrl.create({
      title: 'New Wallet',
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Create new wallet',
      message: 'Add ' + this.wallet.name.toUpperCase() + ' as a new wallet?',
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
            this.addWallet();
            console.log('Adding new wallet');
          }
        }
      ]
    });
    confirm.present();
  }

}
