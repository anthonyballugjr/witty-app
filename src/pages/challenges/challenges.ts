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
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChallengesPage');
    console.log('s ' + this.spareChange);
    console.log('f: ' + this.ftWeek);
  }

  takeChallenge(challengeID){
    this.challengeStatus = true;
    console.log(challengeID);
    
    if(challengeID === 'spareChange'){
      this.spareChange = true;
    }
    else if(challengeID === 'ftWeek'){
      this.ftWeek = true;
    }
    
  }

}
