import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ChallengesProvider } from '../../providers/challenges/challenges';

@IonicPage()
@Component({
  selector: 'page-add-saving-challenge',
  templateUrl: 'add-saving-challenge.html',
})
export class AddSavingChallengePage {
  alert: any;
  loading: any;
  challengeLength: any;

  challenge: any = {
    userId: localStorage.userId,
    title: "",
    description: "",
    expectedAmount: "",
    incrementBy: "",
    length: "",
    count: "",
    type: "",
  }

  count = [
    { id: "day", by: "Daily" },
    { id: "week", by: "Weekly" },
    { id: "month", by: "Monthly" },
    { id: "year", by: "Yearly" }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBldr: FormBuilder, public challengesProvider: ChallengesProvider, private alertCtrl: AlertController, private viewCtrl: ViewController, private loadCtrl: LoadingController) {
  }

  private addChallengeForm = this.formBldr.group({
    title: ["", Validators.required],
    description: ["", Validators.required],
    expectedAmount: ["", Validators.required],
    incrementBy: ["", Validators.required],
    count: ["", Validators.required],
    type: ["", Validators.required],
  });

  addChallenge() {
    console.log('Initial', this.challenge);
    if (this.challenge.type === 'static') {
      this.challenge.length = Math.ceil(this.challenge.expectedAmount / this.challenge.incrementBy);
      console.log(this.challenge.length);
    } else {
      var i = 0;
      var lengthToBe = 0;
      while (i < this.challenge.expectedAmount) {
        lengthToBe++;
        i = i + this.challenge.incrementBy * lengthToBe;
      }
      this.challenge.length = lengthToBe;
      this.challenge.expectedAmount = i;
    }
    console.log('Final', this.challenge, 'I', i);
    let prompt = this.alertCtrl.create({
      title: 'New Saving Challenge',
      subTitle: 'Add new saving challenge?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            this.presentLoading('Adding new challenge...');
            this.challengesProvider.addChallenge(this.challenge)
              .then(data => {
                this.loading.dismiss();
                this.showAlert('Success', 'Added new saving challenge!');
                console.log(data);
                this.viewCtrl.dismiss();
              }, err => {
                this.loading.dismiss();
                this.showAlert('Failed', 'Ooops! Something went wrong! Please try again.');
                console.log(err);
              });
          }
        }
      ]
    });
    prompt.present();
  }

  showAlert(title, subTitle) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  presentLoading(msg) {
    this.loading = this.loadCtrl.create({
      content: `<div>
      <div class="loader"><center><img src="../../assets/imgs/logo.gif"/ height="100px"></center></div>
      <p>${msg}</p>
      </div>`,
      spinner: 'hide'
    });
    this.loading.present();
  }



}
