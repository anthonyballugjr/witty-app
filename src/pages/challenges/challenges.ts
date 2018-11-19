import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Challenges } from '../../data/challenges';

@IonicPage()
@Component({
  selector: 'page-challenges',
  templateUrl: 'challenges.html',
})
export class ChallengesPage {
  challengeStatus: boolean;
  currentChallenge: any;
  challenges = Challenges;

  text: any;
  type: any;

  total = 0;
  current = 0;
  inc = 0;

  numbers = []
  alert: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private events: Events) {
    this.challengeStatus = false;
    this.events.subscribe('status:changed', status => {
      if (this.challengeStatus === false) {
        this.challengeStatus = status;
      }
    });
  }

  takeChallenge(title, expectedAmount, challengelength, count, increment, type) {
    this.events.publish('status:changed', this.challengeStatus = true);
    console.log(this.challengeStatus);

    this.currentChallenge = title;
    this.total = expectedAmount;
    this.inc = increment;
    this.text = count;
    this.type = type;

    this.numbers = Array(challengelength).fill(0).map((x, i) => i + 1);
  }

  deposit(value) {
    if (this.type === "Static") {
      this.current += this.inc;
    }
    else {
      this.current += value * this.inc;
    }

    this.numbers.splice(0, 1);

    if (this.current >= this.total) {

      this.showAlert('<h1>Congratulations Witty Saver!</h1> You haved completed the saving challenge. Take more challenges to earn more titles.')

      this.challengeStatus = false;
      this.current = 0;
      this.total = 0;
      this.numbers = [];
    }
  }

  showAlert(msg) {
    this.alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['OK']
    });
    this.alert.present();
  }

}
