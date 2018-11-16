import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ReportsProvider } from '../../providers/reports/reports';
import { ViewBudgetPage } from '../view-budget/view-budget';

@IonicPage()
@Component({
  selector: 'page-budgets',
  templateUrl: 'budgets.html',
})
export class BudgetsPage {
  overview: any;
  archives: any;

  constructor(private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public reportsProvider: ReportsProvider) {
    this.getArchives();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BudgetsPage');
  }

  getArchives() {
    this.reportsProvider.getArchivesOverview()
      .then(data => {
        this.overview = data;
        this.archives = this.overview.x;
        console.log('Overview', this.overview);
        console.log('Archives', this.archives);
      }, err => {
        console.log(err);
      });
  }

  viewBudget(period) {
    let modal = this.modalCtrl.create(ViewBudgetPage, { period: period });
    modal.present();
  }

}
