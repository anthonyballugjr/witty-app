import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { ChallengesProvider } from '../../providers/challenges/challenges';

@IonicPage()
@Component({
  selector: 'page-edit-saving-challenge',
  templateUrl: 'edit-saving-challenge.html',
})
export class EditSavingChallengePage {
  challenge: any;
  loading: any;
  alert: any;

  count = [
    { id: "day", by: "Daily" },
    { id: "week", by: "Weekly" },
    { id: "month", by: "Monthly" },
    { id: "year", by: "Yearly" }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBldr: FormBuilder, private viewCtrl: ViewController, private alertCtrl: AlertController, private loadCtrl: LoadingController, public challengesProvider: ChallengesProvider) {
    this.challenge = this.navParams.get('challenge');
    console.log(this.challenge);
  }

  private updateChallengeForm = this.formBldr.group({
    title: ["", Validators.required],
    description: ["", Validators.required],
    expectedAmount: ["", Validators.required],
    incrementBy: ["", Validators.required],
    length: ["", Validators.required],
    count: ["", Validators.required],
    type: ["", Validators.required],
  });

  cancel() {
    this.viewCtrl.dismiss();
  }

  presentLoader(msg) {
    this.loading = this.loadCtrl.create({
      spinner: 'hide',
      content: `<div>
      <div class="loader"><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>${msg}</p>
      </div>`
    });
    this.loading.present();
  }

  presentAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Ok']
    });
    alert.present();
  }

  updateChallenge() {
    let prompt = this.alertCtrl.create({
      title: 'Update Saving Challenge',
      subTitle: 'Update this Challenge?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            var update = {
              id: this.challenge._id,
              userId: localStorage.userId,
              title: this.challenge.title,
              description: this.challenge.description,
              expectedAmount: this.challenge.expectedAmount,
              incrementBy: this.challenge.incrementBy,
              length: this.challenge.length,
              count: this.challenge.count,
              type: this.challenge.type,
            }
            this.presentLoader('Updating challenge...');
            this.challengesProvider.update(update)
              .then(data => {
                this.loading.dismiss();
                this.presentAlert('Success!', 'Saving challenge updated')
                console.log(data);
                this.viewCtrl.dismiss();
              }, err => {
                this.loading.dismiss();
                this.presentAlert('Failed', 'Oooops! Something went wrong, Please try again.' + err)
                this.viewCtrl.dismiss();
              });
          }
        }
      ]
    });
    prompt.present();
  }



}
