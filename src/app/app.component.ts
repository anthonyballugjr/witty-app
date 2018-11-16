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
import { BudgetsPage } from '../pages/budgets/budgets';
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
  isLoggedIn: boolean = false;

  user: any;
  nickname: string;
  eWallets: any;
  sWallets: any;
  names: any = [];
  x: any;
  y: any = [];
  predicted: any = [];
  forArchive: any = [];
  pWallet: any;

  activePage: any;

  loading: any;

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


    this.onStart();

    this.nickname = localStorage.nickname;
    this.events.subscribe('nickname:changed', nickname => {
      if (nickname !== undefined && nickname !== " ") {
        this.nickname = nickname;
        console.log(nickname);
      }
    });

    this.pages = [
      { title: 'Home', icon: 'home', component: TabsPage },
      { title: 'Profile', icon: 'person', component: ProfilePage },
      { title: 'Budgets', icon: 'cash', component: BudgetsPage },
      { title: 'Manage Wallets', icon: 'list-box', component: CategoriesPage },
      { title: 'Playground', icon: 'baseball', component: MywalletsPage },
      ]; 
    this.activePage = this.pages[0];
  }

  async onStart() {
    await this.statusBar.hide();
    await this.initializeApp();
    await this.checkAuthorization();
    await this.getProfile();
    await this.getExpenseWallets();
    await this.createBudget();
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

  getProfile() {
    this.authProvider.getProfile()
      .then(data => {
        this.user = data;
        console.log('User',this.user);
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

  showLoader(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
      dismissOnPageChange: false,
      closeButtonText: 'Dismiss',
      showCloseButton: true
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  createBudget() {
    // let today = moment().format('DD');
    // let firstDay = moment().startOf('month').format('DD');
    // console.log('Today', today);
    // if (today === firstDay && this.isLoggedIn && this.user.isNext === false) {

    let alert = this.alertCtrl.create({
      title: 'Create New Budget',
      subTitle: `Hello ${this.nickname.charAt(0).toUpperCase() + this.nickname.slice(1)}!, It is the first day of the month! Witty is now ready to create your budget!, Please choose how you want to create your budget this month.`,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Automatic',
          handler: () => {
            let prompt = this.alertCtrl.create({
              subTitle: 'By choosing these option, Witty will automatically create your wallets and set their amounts for this month based on your historical data. Note that all wallet names will be copied from the previous month. (if you want to change what wallets you want to keep, choose "Modified" option).',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Continue',
                  handler: () => {
                    console.log('Chosen Automatic');
                    this.auto();
                    alert.dismiss();
                  }
                },
              ]
            });
            prompt.present();
            return false;
          }
        },
        {
          text: 'Modified',
          handler: () => {
            let prompt = this.alertCtrl.create({
              subTitle: 'Choosing these option lets you modify what wallets you want to keep from the previous month. Afterwhich, Witty will automatically set their amounts for this month based on your historical data.',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Continue',
                  handler: () => {
                    console.log('Chosen Modified');
                    this.app.getRootNav().setRoot(CreateBudgetPage);
                    alert.dismiss();
                  }
                }
              ]
            });
            prompt.present();
            return false;
          }
        },
        {
          text: 'Manual',
          handler: () => {
            let prompt = this.alertCtrl.create({
              subTitle: 'Choosing these option lets you manually create new wallets and set their budget. Note that previous wallets will not be used and you will be starting fresh.',
              buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel'
                },
                {
                  text: 'Continue',
                  handler: () => {
                    console.log('Chosen Manual');
                    alert.dismiss();
                  }
                }
              ]
            });
            prompt.present();
            return false;
          }
        }
      ]
    });
    alert.present();

  }

  getExpenseWallets() {
    this.expensesProvider.getWallets(pPeriod)
      .then(data => {
        this.sWallets = data;
        for (let wallet of this.sWallets) {
          this.names.push(wallet.name);
        }
        console.log(data);
      }, err => {
        this.presentToast(err);
        console.log(err);
      });
  }

  //auto Creating new month budget
  async auto() {
    this.showLoader('Please wait while Witty is creating your wallets...');

    await this.names.forEach(name => {
      this.expensesProvider.predict(name)
        .then(data => {
          this.x = data;
          this.y = this.x.x;
          for (let wallet of this.y) {
            if (wallet !== null) {
              this.predicted.push(wallet);
              this.pWallet = wallet;
              this.expensesProvider.addWallet(this.pWallet)
                .then(res => {
                  console.log(res);
                }, err => {
                  console.log(err);
                });
            }
          }
        }, err => {
          this.presentToast(err);
          console.log(err);
        });
    });
    console.log('Predicted', this.predicted);

    await this.reportsProvider.getBudgetOverview(pPeriod)
      .then(data => {
        this.forArchive = data;
        console.log('Overview', this.forArchive);
      }, err => {
        this.presentToast(err);
        console.log(err);
      });
    await this.reportsProvider.saveArchive(this.forArchive)
      .then(data => {
        console.log(data);
        this.presentToast('Budget created successfully!');
      }, err => {
        this.presentToast(err);
        console.log(err);
      });
    this.loading.dismiss();
    this.app.getRootNav().setRoot(TabsPage);
  }
  //End auto creating new budget
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

}
