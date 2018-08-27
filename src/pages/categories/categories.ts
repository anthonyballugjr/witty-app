import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
import { EditwalletPage } from '../editwallet/editwallet';
/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  categories: any;

  constructor(public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.getCategories();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  getCategories() {
    this.categoryProvider.getWallets()
      .then(data => {
        this.categories = data;
        console.log(this.categories);
      });
  }
  
  editCategory(){
    this.navCtrl.push(EditwalletPage);
  }

delete(){
  this.alertCtrl.create({
    title: "Delete Transaction",
    subTitle: "Are you sure you want do delete your transaction?",
    buttons: [
      {
        text: "Cancel",
        handler: data => {
        console.log('Cancel clicked');
        }
      },
      {
        text: "Confirm",
      }
    ]
  }).present();
}

}
