import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform, MenuController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { Events } from 'ionic-angular';
import moment from 'moment';
import { cPeriod, nPeriod, pPeriod } from '../data/period';

import { TabsPage } from '../pages/tabs/tabs';;
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { MywalletsPage } from '../pages/mywallets/mywallets';
import { CategoriesPage } from '../pages/categories/categories';
import { CreateBudgetPage } from '../pages/create-budget/create-budget';

import { AuthProvider } from '../providers/auth/auth';
import { ExpensesProvider } from '../providers/expenses/expenses';
import { ReportsProvider } from '../providers/reports/reports';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  loading: any;
  isLoggedIn: boolean = false;
  user: any;
  sWallets: any;
  names: any = [];
  x: any;
  y: any = [];
  predicted: any = [];

  nickname: string;
  activePage: any;

  stat = {
    isNext: false
  }


  checkAuthorization(): void {
    if ((localStorage.getItem('token') === null || localStorage.getItem('token') === 'undefined' || localStorage.getItem('token') === ' ')) {
      this.rootPage = LoginPage;
      this.isLoggedIn = false;
      console.log('Is Logged in?', this.isLoggedIn);
    } else {
      this.rootPage = TabsPage;
      this.isLoggedIn = true;
      console.log('Is Logged in?', this.isLoggedIn);
    }
  }

  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public fullScreen: AndroidFullScreen, public app: App, public menuCtrl: MenuController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, public authProvider: AuthProvider, public platform: Platform, public splashScreen: SplashScreen, public statusBar: StatusBar, public events: Events, private alertCtrl: AlertController, public expensesProvider: ExpensesProvider, public reportsProvider: ReportsProvider) {

    this.doAll();

    this.nickname = localStorage.nickname;
    this.events.subscribe('nickname:changed', nickname => {
      if (nickname !== undefined && nickname !== " ") {
        this.nickname = nickname;
        console.log(nickname);
      }
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', icon: 'home', component: TabsPage },
      { title: 'Profile', icon: 'person', component: ProfilePage },
      { title: 'Manage Wallets', icon: 'list-box', component: CategoriesPage },
      { title: 'Playground', icon: 'baseball', component: MywalletsPage }
    ];
    this.activePage = this.pages[0];
  }

  async doAll() {
    await this.statusBar.hide();
    await this.initializeApp();
    await this.checkAuthorization();
    await this.getProfile();
    await this.createNextBudget();
    await this.saveArchive();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 300)
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.fullScreen.isImmersiveModeSupported()
        .then(() => this.fullScreen.immersiveMode())
        .catch((error: any) => console.log(error))
      this.statusBar.hide();
    });
  }

  createNextBudget() {
    let today = moment().format('DD');
    let lastDay = moment().endOf('month').format('DD');
    let firstDay = moment().startOf('month').format('DD');
    console.log('Today', today, 'Last day', lastDay);
    if (today === lastDay && this.isLoggedIn && this.user.isNext === false) {
      this.presentAlert('it is the last day of the month, Witty is now ready to create your next month budget!');
    }
    else if (today === firstDay && this.isLoggedIn && this.user.isNext === false) {
      this.autoCreateBudget();
    }
  }

  getProfile() {
    this.authProvider.getProfile()
      .then(data => {
        this.user = data;
        console.log(this.user);
      }, err => {
        console.log(err);
      });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page) {
    return page == this.activePage;
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Create Next Budget',
      subTitle: `${localStorage.nickname}, ${msg}`,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Remind me later',
          role: 'cancel'
        },
        {
          text: "Let's do it!",
          handler: () => {
            this.nav.setRoot(CreateBudgetPage);
          }
        }
      ]
    });
    alert.present();
  }

  showLoader(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }

  logout() {
    this.showLoader('Signing out...');
    this.authProvider.logout().then((result) => {
      console.log(result);
      this.menuCtrl.close();
      this.loading.dismiss();
      this.app.getRootNav().setRoot(LoginPage);
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      dismissOnPageChange: false
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  saveArchive() {
    let today = moment().format('DD');
    let day = moment().format('DD');
  }

  async autoCreateBudget() {
    this.names = [];
    this.predicted = [];
    console.log(pPeriod);
    await this.showLoader('Please wait while Witty is creating your new budget');
    await this.expensesProvider.getWallets(pPeriod)
      .then(data => {
        this.sWallets = data;
        for (let wallet of this.sWallets) {
          this.names.push(wallet.name);
        }
        console.log(data);
        console.log(this.names);
      });
    await this.names.forEach(name => {
      this.expensesProvider.auto(name)
        .then(data => {
          this.x = data;
          this.y = this.x.x;
          for (let wallet of this.y) {
            if (wallet !== null) {
              this.predicted.push(wallet);
            }
          }
          this.stat.isNext = true;
        });
    });
    await this.authProvider.updateStat(this.stat)
      .then(data => {
        console.log(this.stat);
        let user = data;
        console.log(user);
      }, err => {
        this.loading.dismiss();
        console.log(err);
      });
    await this.expensesProvider.addWallet(this.predicted)
      .then(res => {
        console.log(res);
        this.loading.dismiss();
      }, err => {
        this.loading.dismiss();
        console.log(err);
      });
    console.log('predicted', this.predicted);
  }

}
