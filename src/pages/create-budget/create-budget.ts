import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { CategoryProvider } from '../../providers/category/category';
import { ReportsProvider } from '../../providers/reports/reports';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-create-budget',
  templateUrl: 'create-budget.html',
})
export class CreateBudgetPage {
  @ViewChild('slider') slider: Slides;

  loading: any;
  alert: any;
  toast: any;

  names: any = [];
  wallets: any;
  listData: any = [];
  overview:any;
  predicted: any = [];
  x: any;
  y: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, public categoryProvider: CategoryProvider, public reportsProvider: ReportsProvider, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private viewCtrl: ViewController, private toastCtrl: ToastController) {
    this.getWallets();
  }

  ionViewDidLoad() {
    console.log('Creating Next Budget');
    this.slider.lockSwipes(true);
  }

  presentAlert(title, content) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: ['Ok']
    });
    this.alert.present();
  }

  presentLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg,
    });
    this.loading.present();
  }

  presentToast(msg) {
    this.toast = this.toastCtrl.create({
      closeButtonText: 'I got it',
      showCloseButton: true,
      message: msg,
      position: 'bottom',
      duration: 10000
    });
    this.toast.present();
  }

  goToSlide(slideNo) {
    this.slider.lockSwipes(false);
    this.slider.slideTo(slideNo, 700);
    this.slider.lockSwipes(true);
  }

  exit() {
    let alert = this.alertCtrl.create({
      title: 'Warning!',
      subTitle: 'The budget creation process will be activated at a later time once cancelled, are you sure you want to skip this process?',
      buttons: [
        {
          text: 'No, continue creating budget',
          role: 'cancel'
        },
        {
          text: 'Yes, I will do this later',
          handler: () => {
            // this.viewCtrl.dismiss();
            this.navCtrl.setRoot(TabsPage);
          }
        }
      ]
    });
    alert.present();
  }

  done(){
    // this.viewCtrl.dismiss();
    this.navCtrl.setRoot(TabsPage);
  }

  getWallets() {
    this.presentLoading('Fetching wallets...');
    this.categoryProvider.getWallets()
      .then(data => {
        this.wallets = data;
        for (let wallet of this.wallets) {
          this.names.push(wallet.name);
          this.listData.push({ name: wallet.name, category: wallet.category, type: wallet.type });
        }
        this.loading.dismiss();
        this.presentToast("Remove wallets you do not need for your next month's budget, if you are satisfied with your wallets, you can proceed by tapping the 'NEXT' button")
        console.log('List Data', this.listData);
        console.log('Names', this.names);
      }, err => {
        this.loading.dismiss();
        console.log(err);
      });
  }

  remove(wallet) {
    let alert = this.alertCtrl.create({
      title: 'Remove Wallet',
      subTitle: 'Remove wallet from list?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            this.listData.pop(wallet);
            this.names.pop(wallet.name);
            console.log('List Data', this.listData);
          }
        }
      ]
    });
    alert.present();
  }

  predict() {
    if (this.predicted.length > 0) {
      this.goToSlide(1);
    }
    else {
      this.presentLoading('Predicting Values...');
      this.names.forEach(name => {
        this.reportsProvider.predict(name)
          .then(data => {
            this.x = data;
            this.y = this.x.x;
            for (let wallet of this.y) {
              if (wallet !== null) {
                this.predicted.push(wallet);
              }
            }
            this.reportsProvider.getCurrentBudgetOverview()
              .then(ov => {
                this.overview = ov;
                console.log('Ov', ov);
              })
          }, err => {
            console.log(err);
          });
      }, err => {
        this.loading.dismiss();
        console.log(err);
      });
      this.loading.dismiss();
      this.goToSlide(1);
      this.toast.dismiss();
    }
    console.log('Predicted Data', this.predicted);
    console.log(this.overview);
  }

  save() {
    this.presentLoading('Adding wallet for next month')
    this.categoryProvider.addWallet(this.predicted)
      .then(result => {
        console.log(result);
        this.loading.dismiss();
        this.goToSlide(2);
        this.presentAlert('Success!', 'Wallets successfully created');
      }, err => {
        this.loading.dismiss();
        console.log(err);
        this.presentAlert('Failed', err.error);
      });
  }


}
