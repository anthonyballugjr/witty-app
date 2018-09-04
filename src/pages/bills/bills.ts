import { Component } from '@angular/core';
import { IonicPage, ViewController, NavController, NavParams, AlertController, LoadingController, ToastController, Platform } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

@IonicPage()
@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html',
})
export class BillsPage {
  calName = "";
  events = [];
  alert: any;
  print: any;

  period: any;

  loading: any;
  toast: any;

  constructor(private viewCtrl: ViewController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private plt: Platform, private calendar: Calendar, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.calName = navParams.get('name');
  }

  ionViewDidLoad() {
    if (this.plt.is('ios')) {
      this.calendar.findAllEventsInNamedCalendar(this.calName).then(data => {
        this.events = data;
      });
    } else if (this.plt.is('android')) {
      let start = new Date();
      let end = new Date();
      end.setDate(end.getDate() + 31);

      this.calendar.listEventsInRange(start, end).then(data => {
        this.events = data;
        this.print = JSON.stringify(data);
      });
    }
  }

  openCalendar(data) {
    var date = new Date(data.dtstart);
    this.calendar.openCalendar(date).then(res => {
      this.plt.registerBackButtonAction(() => {
        this.ionViewDidLoad();
      });
    }, err => {
      console.log('err: ', err);
    });
  }

  deleteEvent(data) {
    var details = data;
    const confirm = this.alertCtrl.create({
      title: 'Delete Event',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancelled');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            var start = new Date(details.dtstart);
            var end = new Date(details.dtend);
            this.presentLoading('Deleting Event');
            this.calendar.deleteEvent(details.title, details.location, details.notes, start, end).then((result) => {
              this.loading.dismiss();
              this.presentToast(result);
              this.ionViewDidLoad();
            }, err => {
              this.loading.dismiss();
              this.presentToast(err);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  presentLoading(content) {
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: content
    });
    this.loading.present();
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      dismissOnPageChange: false
    });
    this.toast.present();
  }

  presentAlert(msg) {
    this.alert = this.alertCtrl.create({
      message: msg,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}

