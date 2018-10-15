import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-challenges',
  templateUrl: 'challenges.html',
})
export class ChallengesPage {
  challengeStatus = false;

  spareChange = false;
  ftWeek = false;

  total = 0;
  current = 0;
  challengeLength = 0;

  numbers = []
  
  challenges = [
    {
      challengeID: 'spareChange',
      title: 'The Spare Change Challenge',
      description: 'The spare change challenge is simply what the name suggests. Throughout the year, the goal is to save all of your spare change.',
      expectedAmount: 0

    },
    {
      challengeID: 'ftWeek',
      title: '52-Week Challenge',
      description: 'This challenge involves saving an increasing amount each week until the end of the year. This version of the challenge starts at PHP 5 and has a weekly increment of PHP 5 each week.',
      expectedAmount: 6890
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.numbers = Array(52).fill(0).map((x, i)=> i + 1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChallengesPage');
  }

  takeChallenge(challengeID){
    this.challengeStatus = true;
    
    if(challengeID === 'spareChange'){
      this.spareChange = true;
    }
    else if(challengeID === 'ftWeek'){
      this.ftWeek = true;
      this.total = 6890;
    }
  }

  deposit(value){
    this.current += value * 5;
    this.numbers.splice(0, 1);
    console.log(value);
  }

}