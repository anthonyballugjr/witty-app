import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-datapolicy',
  templateUrl: 'datapolicy.html',
})
export class DatapolicyPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DatapolicyPage');
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

}