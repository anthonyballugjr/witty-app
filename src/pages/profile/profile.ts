import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as jsPDF from 'jspdf';

import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  editData = {
    "user": {
      "name": ""
    }
  }
  userData: any;
  email: any;
  nickname: any;
  @ViewChild('content') content: ElementRef;

  constructor(public authProvider: AuthProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getProfile();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getProfile() {
    this.authProvider.getProfile()
      .then(data => {
        this.userData = data;
        console.log(this.userData);
        this.email = this.userData.user.email;
        this.nickname = this.userData.user.name;
      });
  }

  export() {
    let doc = new jsPDF();

    let specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    let content = this.content.nativeElement;

    doc.fromHTML(content.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('transcript.pdf');
  }

}
