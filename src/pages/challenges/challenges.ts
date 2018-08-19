import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



/**
 * Generated class for the ChallengesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-challenges',
  templateUrl: 'challenges.html',
})
export class ChallengesPage {
  information: any[];
  shownGroup = null;
  data = [
    {
      title: "Challenge 1",
      details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et nisi libero. Nullam ut interdum est, sit amet pretium sem. Pellentesque vitae sodales mi. Nam efficitur mattis suscipit. Sed ipsum enim, efficitur id quam nec, tristique sagittis ligula. Aliquam luctus nisl vel convallis volutpat. Fusce ac tincidunt nulla. Mauris sem augue, pellentesque et elementum eget, suscipit ut nisi"
    },
    {
      title: "Challenge 2",
      details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et nisi libero. Nullam ut interdum est, sit amet pretium sem. Pellentesque vitae sodales mi. Nam efficitur mattis suscipit. Sed ipsum enim, efficitur id quam nec, tristique sagittis ligula. Aliquam luctus nisl vel convallis volutpat. Fusce ac tincidunt nulla. Mauris sem augue, pellentesque et elementum eget, suscipit ut nisi."
    },
    {
      title: "Challenge 3",
      details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et nisi libero. Nullam ut interdum est, sit amet pretium sem. Pellentesque vitae sodales mi. Nam efficitur mattis suscipit. Sed ipsum enim, efficitur id quam nec, tristique sagittis ligula. Aliquam luctus nisl vel convallis volutpat. Fusce ac tincidunt nulla. Mauris sem augue, pellentesque et elementum eget, suscipit ut nisi"
    }

  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    }
    else {
      this.shownGroup = group;
    }
  }

  isGroupShown(group) {
    return this.shownGroup === group;
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad ChallengesPage');
  }

}
