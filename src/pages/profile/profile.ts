import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, ToastController, Platform } from 'ionic-angular';
import moment from 'moment';
import * as jsPDF from 'jspdf';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  pdfObj = null;

  userData: any = [];
  budgetProfile: any = [];
  email: any;
  nickname: any;

  toast: any;

  constructor(public alertCtrl: AlertController, private popCtrl: PopoverController, public reportProvider: ReportsProvider, public authProvider: AuthProvider, public navCtrl: NavController, public navParams: NavParams, private file: File, private fileOpener: FileOpener, private toastCtrl: ToastController, private plt: Platform) {
    this.getProfile();
    this.getBudgetProfile();
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

  getBudgetProfile() {
    this.reportProvider.budgetProfile()
      .then(data => {
        this.budgetProfile = data;

        this.budgetProfile.overallBudget = this.budgetProfile.overallBudget.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.overallExpenses = this.budgetProfile.overallExpenses.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.overallDeposits = this.budgetProfile.overallDeposits.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.overallEWallets = this.budgetProfile.overallEWallets.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.overallWithdrawals = this.budgetProfile.overallWithdrawals.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.overallTransactions = this.budgetProfile.overallTransactions.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.overallSavings = this.budgetProfile.overallSavings.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.overallExtra = this.budgetProfile.overallExtra.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.averageMonthlyBudget = this.budgetProfile.averageMonthlyBudget.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.averageMonthlyExpenses = this.budgetProfile.averageMonthlyExpenses.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        this.budgetProfile.averageMonthlySavings = this.budgetProfile.averageMonthlySavings.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        console.log('BudgetProfile', this.budgetProfile);

      });
  }

  getProfile() {
    this.authProvider.getProfile()
      .then(data => {
        this.userData = data;
        console.log('Profile', this.userData);
      }, err => {
        console.log(err);
      });
  }

  showPopover(event, menu) {
    let pop = this.popCtrl.create(PopovermenuComponent, { menu: menu, name: this.userData.name });
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

  createPdf() {
    var docDefinition = {
      pageSize: 'A5',
      content: [
        { text: `Generated: ${moment(new Date()).format('MMMM DD, YYYY')}`, alignment: 'right', style: 'date' },
        { text: '' },
        { text: 'Witty Profile', style: 'header' },
        { text: 'Account Details', style: 'subheader' },

        {
          columns: [
            { width: '50%', text: 'Email Address:', bold: true },
            { width: 'auto', text: this.userData.email }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Nickname:', bold: true },
            { width: 'auto', text: this.userData.name }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Title:', bold: true },
            { width: 'auto', text: 'Witty User' }
          ]
        },

        { text: '', style: 'header' },
        { text: 'Budget Profile', style: 'subheader' },
        {
          columns: [
            { width: '50%', text: 'Overall Total Deposits', style: 'smaller' },
            { width: 'auto', text: `₱ ${this.budgetProfile.overallDeposits}`, style: 'smaller' }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Overall Expense Wallets Budget', style: 'smaller' },
            { width: 'auto', text: `₱ ${this.budgetProfile.overallEWallets}`, style: 'smaller' }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Overall Total Budget', style: 'strong' },
            { width: 'auto', text: `₱ ${this.budgetProfile.overallBudget}`, style: 'strong' }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Overall Total Withdrawals', style: 'smaller' },
            { width: 'auto', text: `₱ ${this.budgetProfile.overallWithdrawals}`, style: 'smaller' }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Overall Total Transactions', style: 'smaller' },
            { width: 'auto', text: `₱ ${this.budgetProfile.overallTransactions}`, style: 'smaller' }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Overall Total Expenditures', style: 'strong' },
            { width: 'auto', text: `₱ ${this.budgetProfile.overallExpenses}`, style: 'strong' }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Average Monthly Budget', style: 'strongx' },
            { width: 'auto', text: `₱ ${this.budgetProfile.averageMonthlyBudget}`, style: 'strongx' }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Average Monthly Expenses', style: 'strongx' },
            { width: 'auto', text: `₱ ${this.budgetProfile.averageMonthlyExpenses}`, style: 'strongx' }
          ]
        },
        {
          columns: [
            { width: '50%', text: 'Average Monthly Savings', style: 'strongx' },
            { width: 'auto', text: `₱ ${this.budgetProfile.averageMonthlySavings}`, style: 'strongx' }
          ]
        }

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 20, 0, 20]
        },
        strong: {
          fontSize: 12,
          bold: true,
          margin: [0, 0, 0, 20]
        },
        strongx: {
          fontSize: 12,
          bold: true,
        },
        smaller: {
          fontSize: 9
        },
        date: {
          fontSize: 7,
          margin: [0, 0, 0, 20]
        }
      }
    }
    if (this.plt.is('cordova')) {
      const title = 'Witty Profile';
      const fileDirectory = this.file.dataDirectory;
      this.pdfObj = pdfMake.createPdf(docDefinition);
      alert(`File will be saved in ${fileDirectory}`);
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        this.file.writeFile(fileDirectory, title, blob, { replace: true })
          .then(fileEntry => {
            this.presentToast(`File Created! ${fileEntry}`)
            this.fileOpener.open(fileDirectory + title, 'appliction/pdf');
          })
          .catch((error) => {
            this.presentToast(`Unable to create file! ${error}`);
          });
      });
    } else {
      this.pdfObj = pdfMake.createPdf(docDefinition);
      this.pdfObj.download();
    }
  }

  exportProfile() {
    var doc = new jsPDF();
    doc.setFontSize(35);
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

    const directory = this.file.dataDirectory;
    alert('File will be saved in ' + directory);
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
