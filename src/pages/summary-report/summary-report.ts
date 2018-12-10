import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-summary-report',
  templateUrl: 'summary-report.html',
})
export class SummaryReportPage {
  archivedData: any;
  oldWallets: any = [];
  newWallets: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.archivedData = this.navParams.get('archivedData');
    this.oldWallets = this.navParams.get('oldWallets');
    this.newWallets = this.navParams.get('newWallets');
  }

  


}
