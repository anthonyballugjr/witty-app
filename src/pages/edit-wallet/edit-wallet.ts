import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

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

  constructor(private alertCtrl: AlertController, private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
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
      "id": this.walletData._id,
      "name": this.walletData.name,
      "amount": this.walletData.amount
    }
    const confirm = this.alertCtrl.create({
      title: 'Update wallet',
      message: 'update this wallet?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('update cancelled');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log(updateData);
            this.viewCtrl.dismiss(updateData);
          }
        }
      ]
    });
    confirm.present();
  }

}
