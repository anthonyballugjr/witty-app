import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications';

/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationsProvider {
  localNotifs: any = [];

  constructor(public http: HttpClient, public localNotification: LocalNotifications) {
    this.localNotifs = this.localNotification.getAll();
    console.log('Hello NotificationsProvider Provider');
  }

  addNotification(data) {
    return new Promise((resolve, reject) => {
      var date = new Date(data.date + " " + data.time);
      this.localNotification.schedule({
        title: data.title,
        text: data.description,
        trigger: { at: date },
        led: 'FF0000',
        sound: this.setSound(),
        icon: 'notifications'
      });
      console.log(this.localNotification.getAllScheduled());
    });
  }

  getNotifications() {
    return new Promise(resolve => {
      this.localNotification.getAll().then(data => {
        resolve(data);
        console.log(data);
      }, err => {
        console.log(err);
      })
    })
  }

  setSound() {
    return '../../assets/sounds/chaching.wav';
  }

}
