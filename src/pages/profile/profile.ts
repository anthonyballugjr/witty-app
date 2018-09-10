import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import * as jsPDF from 'jspdf';

import { AuthProvider } from '../../providers/auth/auth';
import { PopovermenuComponent } from '../../components/popovermenu/popovermenu';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  editData = {
    "name": ""
  }
  userData: any;
  email: any;
  nickname: any;
  @ViewChild('content') content: ElementRef;

  constructor(public alertCtrl: AlertController, private popCtrl: PopoverController, public authProvider: AuthProvider, public navCtrl: NavController, public navParams: NavParams) {
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

  showPopover(event) {
    let pop = this.popCtrl.create(PopovermenuComponent, { menu: "profile", name: this.nickname });
    pop.present({
      ev: event
    });
    pop.onDidDismiss(data=>{
      console.log(data);
      if(data){
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
