import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userData = localStorage
 

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(this.userData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  exit(){
    this.navCtrl.setRoot(TabsPage);
  }

}
