import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';


/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {


  data = { title: '', description: '', date: '', time: '' };

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public localNotif: LocalNotifications, public platform: Platform) {

  }

  ionViewDidLoad() {
    console.log(this.localNotif.getAll());
    console.log('ionViewDidLoad NotificationsPage');
  }

  submit() {
    console.log(this.data);
    var date = new Date(this.data.date + " " + this.data.time);
    console.log(date);
    this.localNotif.schedule({
      text: this.data.title + ":<br>" + this.data.description,
      trigger: { at: date },
      led: 'FF0000',
      sound: this.setSound(),
    });
    let alert = this.alertCtrl.create({
      title: 'Congratulations!',
      subTitle: 'Notification setup successfully at ' + date,
      buttons: ['OK']
    });
    alert.present();
    this.data = { title: '', description: '', date: '', time: '' };
  }

  setSound() {
    return '../../assets/sounds/chaching.wav'
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
