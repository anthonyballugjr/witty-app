import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, ToastController } from 'ionic-angular';
import * as jsPDF from 'jspdf';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import { AuthProvider } from '../../providers/auth/auth';
import { ReportsProvider } from '../../providers/reports/reports';
import { PopovermenuComponent } from '../../components/popovermenu/popovermenu';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  @ViewChild('profile') profile: ElementRef;

  editData = {
    "name": ""
  }

  userData: any = [];
  budgetProfile: any = [];
  email: any;
  nickname: any;

  toast: any;

  constructor(public alertCtrl: AlertController, private popCtrl: PopoverController, public reportProvider: ReportsProvider, public authProvider: AuthProvider, public navCtrl: NavController, public navParams: NavParams, private file: File, private fileOpener: FileOpener, private toastCtrl: ToastController) {
    this.getProfile();
    this.getArchivesOverview();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      showCloseButton: true,
      message: msg,
      duration: 3000,
      position: 'top'
    });
    this.toast.present();
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
        console.log('Profile', this.userData);
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

  exportProfile() {
    var doc = new jsPDF();
    doc.setFontSize(29);
    doc.setFont('helvetica');


    let specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    let content = this.profile.nativeElement;

    doc.fromHTML(content.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    let pdfOutput = doc.output();
    let buffer = new ArrayBuffer(pdfOutput.length);
    let array = new Uint8Array(buffer);
    for (var i = 0; i < pdfOutput.length; i++) {
      array[i] = pdfOutput.charCodeAt(i);
    }

    const directory = this.file.externalApplicationStorageDirectory;
    alert(directory);
    const fileName = "Witty-Budget-Profile.pdf";
    this.file.writeFile(directory, fileName, buffer, { replace: true })
      .then((success) => {
        this.presentToast('File Created!' + success);
        this.fileOpener.open(directory + fileName, 'application/pdf');
      })
      .catch((error) => {
        this.presentToast('Unable to create file!' + error);
      });

    // doc.save('transcript.pdf');
  }

}
