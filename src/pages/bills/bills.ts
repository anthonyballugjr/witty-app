import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController,Platform } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import * as moment from 'moment';

import { AddBillPage } from '../../pages/add-bill/add-bill';

/**
 * Generated class for the BillsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html',
})
export class BillsPage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();

  calendar = {
    mode: "month",
    currentDate: this.selectedDay
  }

  notifications: any;

  calendars = [];


  constructor(private plt: Platform,private cal: Calendar, public modalCtrl: ModalController, private alertCtrl: AlertController, public notifProvider: NotificationsProvider, public navCtrl: NavController, public navParams: NavParams) {
    // this.plt.ready().then(()=>{
    //   this.cal.listCalendars().then(data=>{

    //   });
    // });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BillsPage');
    this.getNotifications();
  }

  addEvent(cal){

  }

  getNotifications() {
    this.notifProvider.getNotifications()
      .then(data => {
        this.notifications = data;
        console.log(this.notifications);
      }, err => {
        console.log(err);
      });
  }

  addBill() {
    let modal = this.modalCtrl.create(AddBillPage, { selectedDay: this.selectedDay });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        })
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['Ok']
    });
    alert.present();
  }



}

