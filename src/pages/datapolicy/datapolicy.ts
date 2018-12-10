import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-datapolicy',
  templateUrl: 'datapolicy.html',
})
export class DatapolicyPage {
  view: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.view = this.navParams.get('view');
    console.log('View', this.view);
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}