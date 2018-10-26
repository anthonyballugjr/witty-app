import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { Challenges } from '../../data/data';

@IonicPage()
@Component({
  selector: 'page-challenges',
  templateUrl: 'challenges.html',
})
export class ChallengesPage {
  challengeStatus = false;
  challenges = Challenges;

  spareChange = false;
  ftWeek = false;
  current = 0;
  total = 0;
  challengeLength = 0;

  numbers = []
  x: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    this.numbers = Array(52).fill(0).map((x, i) => i + 1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChallengesPage');
  }

  takeChallenge(challengeID) {
    this.challengeStatus = true;
    if (challengeID === 'spareChange') {
      this.spareChange = true;
    }
    else if (challengeID === 'ftWeek') {
      this.ftWeek = true;
      this.total = 6890;
    }
  }

  deposit(value) {
    this.current += value * 5;
    this.numbers.splice(0, 1);
    console.log(value);
  }

}