import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { LocalNotifications } from '@ionic-native/local-notifications';


/**
 * Generated class for the AddBillPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-bill',
  templateUrl: 'add-bill.html',
})
export class AddBillPage {

  alert: any;

  isChecked: boolean = false;

  bill = {
    title: "", //title
    description: "", //location //message
    date: "", //start //end
    time: "",
    type: ""
  }

  constructor(private viewCtrl: ViewController, private alertCtrl: AlertController, public calendar: Calendar, public notification: LocalNotifications, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddBillPage');
  }

  // save(){
  //   console.log(this.bill, this.type, this.isChecked);
  // }

  close() {
    this.viewCtrl.dismiss();
  }

  saveNotification() {
    var date = new Date(this.bill.date + " " + this.bill.time);
    console.log(date);
    if (this.bill.type === 'recurring') {
      this.notification.schedule({
        title: 'Witty Wallet',
        text: this.bill.title + ":<br>" + this.bill.description,
        trigger: { at: date },
        led: 'FF0000',
        sound: null,
        every: 'month'
      });
    }
    else {
      this.notification.schedule({
        title: 'Witty Wallet',
        text: this.bill.title + ":<br>" + this.bill.description,
        trigger: { at: date },
        led: 'FF0000',
        sound: null,
      });
    }
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: 'Bill added successfully!',
      buttons: ['Ok']
    });
    alert.present();
    this.bill = {
      title: "",
      description: "",
      date: "",
      time: "",
      type: ""
    }
  }

  saveBill() {
    console.log(this.bill, this.isChecked);
    if (this.bill.type === 'recurring') {
      let options = { recurrence: 'monthly' };
      this.calendar.createEventInteractivelyWithOptions(this.bill.title, " ", this.bill.description, new Date(this.bill.date), new Date(this.bill.date), options)
        .then((result) => {
          console.log(result);
          this.showAlert('Success', 'Successfully Saved');
          this.saveNotification();
          location.reload();
        }, (err) => {
          console.log(err);
        });
    } else {
      this.calendar.createEvent(this.bill.title, " ", this.bill.description, new Date(this.bill.date), new Date(this.bill.date))
        .then((result) => {
          console.log(result);
          this.showAlert('Success', 'Successfully Saved');
          this.saveNotification();
          location.reload();
        }, (err) => {
          console.log(err);
        });
    }
  }

  showAlert(title, message) {
    this.alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Add Bill',
      message: 'Confirmation',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Adding');
          }
        }
      ]
    });
    confirm.present();
  }

}
