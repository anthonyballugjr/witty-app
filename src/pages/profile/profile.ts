import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

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
    this.navCtrl.setRoot(HomePage);
  }

}
