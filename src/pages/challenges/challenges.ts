import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Events, PopoverController, ToastController } from 'ionic-angular';
import { Challenges } from '../../data/challenges';
import { ChallengesProvider } from '../../providers/challenges/challenges';
import { AddSavingChallengePage } from '../add-saving-challenge/add-saving-challenge';
import { PopovermenuComponent } from '../../components/popovermenu/popovermenu';

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

  //challengesDB
  active: any;
  dbChallenges: any;
  status = false;
  activeChallenge: any;
  num = [];
  depo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public challengesProvider: ChallengesProvider, private modalCtrl: ModalController, private popCtrl: PopoverController, private toastCtrl: ToastController) {
    this.challengeStatus = false;
    this.doAll();
  }

  async doAll() {
    await this.getChallenges();
  }

  showPopover(event, menu, challenge) {
    let pop = this.popCtrl.create(PopovermenuComponent, { menu: menu, challenge: challenge });
    pop.present({
      ev: event
    });
    pop.onDidDismiss(() => {
      this.getChallenges();
    });
  }

  addChallenge() {
    let modal = this.modalCtrl.create(AddSavingChallengePage);
    modal.present();

    modal.onDidDismiss(() => {
      this.getChallenges();
    });
  }

  showDescription(challenge) {
    let desc = this.alertCtrl.create({
      title: challenge.title,
      subTitle: challenge.description,
      buttons: ['Ok']
    });
    desc.present();
  }

  getChallenges() {
    this.challengesProvider.getChallenges()
      .then(data => {
        this.dbChallenges = data;
        var count = 0;
        for (let c of this.dbChallenges) {
          if (c.active === true) {
            this.activeChallenge = c;
            count += 1;
          }
        }
        if (count === 0) {
          this.status = false;
        } else {
          this.status = true
          var x = this.activeChallenge.length;
          console.log(x);
          this.num = Array(this.activeChallenge.length).fill(0).map((x, i) => i + 1);

          this.num.splice(0, this.activeChallenge.progress);
        }
        console.log('Active challenge', this.activeChallenge);
        console.log('Count', count);
        console.log('Challenges', this.dbChallenges);
      });
  }

  takeChall(challenge) {
    console.log(challenge);
    let alert = this.alertCtrl.create({
      title: challenge.title,
      subTitle: challenge.description,
      message: 'Take Challenge?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            var activate = {
              id: challenge._id,
              active: true
            }
            this.challengesProvider.update(activate)
              .then(data => {
                console.log(data);
                this.getChallenges();

              }, err => {
                console.log(err);
              });
          }
        }
      ]
    });
    alert.present();

  }

  dep(value) {
    console.log('Value', value);
    if (this.activeChallenge.type === 'static') {
      var update = {
        id: this.activeChallenge._id,
        current: this.activeChallenge.current + this.activeChallenge.incrementBy,
        progress: this.activeChallenge.progress + 1
      }
    } else {
      update = {
        id: this.activeChallenge._id,
        current: this.activeChallenge.current + (value * this.activeChallenge.incrementBy),
        progress: this.activeChallenge.progress + 1
      }
    }

    this.challengesProvider.update(update)
      .then(data => {
        this.depo = data;
        if (this.depo.current >= this.depo.expectedAmount) {
          let successAlert = this.alertCtrl.create({
            title: 'Congratulations',
            subTitle: `You have completed ${this.depo.title} challenge!`,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  var done = {
                    id: this.depo._id,
                    active: false,
                    completed: true,
                    current: 0,
                    progress: 0
                  }
                  this.challengesProvider.update(done)
                    .then(data => {
                      this.getChallenges();
                      console.log(data);
                    }, err => {
                      this.presentToast(err);
                      console.log(err);
                    });
                }
              }
            ]
          });
          successAlert.present();
        } else {
          // this.showAlert('Added deposit!');
          this.getChallenges();
        }
      }, err => {
        this.presentToast(err);
        console.log(err);
      });
  }

  showAlert(title, msg) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    this.alert.present();
  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      duration: 2000,
      closeButtonText: 'Dismiss',
      message: msg,
      dismissOnPageChange: true
    });
    toast.present();
  }

}
