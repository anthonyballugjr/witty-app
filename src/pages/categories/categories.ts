import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';

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

  constructor(public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams) {
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

}
