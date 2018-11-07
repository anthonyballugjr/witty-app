import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-challenges',
  templateUrl: 'challenges.html',
})
export class ChallengesPage {
  challengeStatus = false;
  currentChallenge: any;

  text: any;
  type: any;

  total = 0;
  current = 0;
  inc = 0;

  numbers = []
  alert: any;

  challenges = [
    {
      title: '31-Day Challenge',
      description: 'Some saving challenges take too long to finish so people have a hard time sticking to them. This challenge provides a short-term goal to encourage saving.',
      expectedAmount: 620,
      increment: 20,
      length: 31,

      count: 'Day',
      type: 'Static'
    },
    {
      title: '52-Week Challenge',
      description: 'This challenge involves saving an increasing amount each week until the end of the year. This version of the challenge starts at PHP 5 and has a weekly increment of PHP 5 each week.',
      expectedAmount: 6890,
      increment: 5,
      length: 52,

      count: 'Week',
      type: 'Incremental'
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChallengesPage');
  }

  takeChallenge(title, expectedAmount, challengelength, count, increment, type) {
    this.challengeStatus = true;

    this.currentChallenge = title;
    this.total = expectedAmount;
    this.inc = increment
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
      this.showAlert('<h1>Congratulations Witty Saver!</h1> You haved completed the saving challenge.')
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
