import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';

import {TabsPage} from '../tabs/tabs';

/**
 * Generated class for the MywalletsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mywallets',
  templateUrl: 'mywallets.html',
})
export class MywalletsPage {
  wallets:any;
  userData: any;

  constructor(public categoryProvider: CategoryProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getWallets();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MywalletsPage');
  }

  getWallets() {
    this.categoryProvider.getWallets()
    .then(data =>{
      this.wallets = data;
      console.log(this.wallets);
    });
  }

  exit(){
    this.navCtrl.setRoot(TabsPage);
  }

}
