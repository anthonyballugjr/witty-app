import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ReportsProvider } from '../../providers/reports/reports';

@IonicPage()
@Component({
  selector: 'page-view-archive',
  templateUrl: 'view-archive.html',
})
export class ViewArchivePage {
  summaryData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public reportsProvider: ReportsProvider, private viewCtrl: ViewController) {
    this.summaryData = this.navParams.get('summaryData');
    console.log(this.summaryData);
  }

  close() {
    this.viewCtrl.dismiss();
  }


}
