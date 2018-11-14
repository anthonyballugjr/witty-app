import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Categories } from '../../data/data';

@IonicPage()
@Component({
  selector: 'page-edit-wallet',
  templateUrl: 'edit-wallet.html',
})
export class EditWalletPage {
  type: any;
  categories = Categories

  walletData: any;
  name: any;
  amount: any;

  constructor(private alertCtrl: AlertController, private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.walletData = this.navParams.get('wallet');
    this.type = this.navParams.get('type');
    console.log('Type', this.type);
    console.log(this.walletData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditWalletPage');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  update() {
    var updateData;
    if (this.type === 'expense') {
      updateData = {
        "id": this.walletData._id,
        "name": this.walletData.name,
        "amount": this.walletData.amount,
        "categoryId": this.walletData.categoryId
      }
    } else {
      updateData = {
        "id": this.walletData._id,
        "name": this.walletData.name,
        "goal": this.walletData.goal
      }
    }

    const confirm = this.alertCtrl.create({
      title: 'Update wallet',
      message: 'Update this wallet?',
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
