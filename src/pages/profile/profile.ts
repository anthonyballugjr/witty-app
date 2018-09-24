import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import * as jsPDF from 'jspdf';

import { AuthProvider } from '../../providers/auth/auth';
import { ReportsProvider } from '../../providers/reports/reports';
import { PopovermenuComponent } from '../../components/popovermenu/popovermenu';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild('content') content: ElementRef;

  editData = {
    "name": ""
  }

  userData: any = [];
  budgetProfile: any = [];
  email: any;
  nickname: any;

  constructor(public alertCtrl: AlertController, private popCtrl: PopoverController, public reportProvider: ReportsProvider, public authProvider: AuthProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getProfile();
    this.getArchivesOverview();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getArchivesOverview() {
    this.reportProvider.getArchivesOverview()
      .then(data => {
        this.budgetProfile = data;
        console.log('budgetProfile: ', this.budgetProfile);
      });
  }

  getProfile() {
    this.authProvider.getProfile()
      .then(data => {
        this.userData = data;
        console.log(this.userData);
      });
  }


  showPopover(event) {
    let pop = this.popCtrl.create(PopovermenuComponent, { menu: "profile", name: this.userData.name });
    pop.present({
      ev: event
    });
    pop.onDidDismiss(data => {
      console.log(data);
      if (data) {
        this.getProfile();
      }

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
