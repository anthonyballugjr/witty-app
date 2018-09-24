import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReportsProvider } from '../../providers/reports/reports';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

@IonicPage()
@Component({
  selector: 'page-view-archive',
  templateUrl: 'view-archive.html',
})
export class ViewArchivePage {
  archiveData: any;
  archives: any;
  archiveId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public reportsProvider: ReportsProvider) {
    this.getArchives();
  }

  getArchives() {
    this.reportsProvider.getEntries()
      .then(data => {
        this.archives = data;
        console.log(this.archives);
      }, err => {
        console.log(err);
      });
  }

  getEntry() {
    console.log(this.archiveId);
    this.reportsProvider.getEntry(this.archiveId)
      .then(data => {
        this.archiveData = data;
        console.log(this.archiveData);
      }, err => {
        console.log(err);
      });
  }

}
