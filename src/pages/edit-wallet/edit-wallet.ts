import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the EditWalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-wallet',
  templateUrl: 'edit-wallet.html',
})
export class EditWalletPage {
  
  walletData: any;
  name: any;
  amount: any;

  constructor(private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.walletData = this.navParams.get('wallet');
    console.log(this.walletData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditWalletPage');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  update() {
    var updateData = {
      "id": this.walletData.id,
      "name": this.walletData.name,
      "amount": this.walletData.amount
    }
    console.log(updateData);
    this.viewCtrl.dismiss(updateData);
  }

}
