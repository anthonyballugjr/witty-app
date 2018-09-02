import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { CategoryProvider } from '../../providers/category/category';


@IonicPage()
@Component({
  selector: 'page-addwallet',
  templateUrl: 'addwallet.html',
})
export class AddwalletPage {
  categories: any;
  wallet = {
    'name': '',
    'userId': localStorage.userId,
    'type': '',
    'amount': '',
    'categoryId': ''
  }

  loading: any;

  constructor(private viewCtrl: ViewController, public loadCtrl: LoadingController, private formBldr: FormBuilder, public alertCtrl: AlertController, public navCtrl: NavController, public categoryProvider: CategoryProvider, public navParams: NavParams) {
    this.getCategories();
  }

  private addWalletForm = this.formBldr.group({
    name: ["", Validators.required],
    budget: ["", Validators.required],
    type: ["", Validators.required],
    categoryId: [""]
  });

  getCategories() {
    this.categoryProvider.getCategories()
      .then(data => {
        this.categories = data;
      });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  addWallet(){
    const confirm = this.alertCtrl.create({
      title: 'New Wallet',
      message: 'Add new wallet?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: ()=>{
            console.log('cancelled');
          }
        },
        {
          text: 'Agree',
          handler: ()=>{
            console.log(this.wallet);
            this.viewCtrl.dismiss(this.wallet);
          }
        }
      ]
    });
    confirm.present();
  }

}
