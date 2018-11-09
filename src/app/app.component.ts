import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform, MenuController, ToastController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { Events } from 'ionic-angular';
import moment from 'moment';

import { TabsPage } from '../pages/tabs/tabs';;
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { MywalletsPage } from '../pages/mywallets/mywallets';
import { CategoriesPage } from '../pages/categories/categories';


import { AuthProvider } from '../providers/auth/auth';
import { CreateBudgetPage } from '../pages/create-budget/create-budget';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  loading: any;


  nickname: string;
  activePage: any;

  checkAuthorization(): void {
    if ((localStorage.getItem('token') === null || localStorage.getItem('token') === 'undefined')) {
      this.rootPage = LoginPage;
    } else {
      this.rootPage = TabsPage;
    }
  }

  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public fullScreen: AndroidFullScreen, public app: App, public menuCtrl: MenuController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, public authProvider: AuthProvider, public platform: Platform, public splashScreen: SplashScreen, public statusBar: StatusBar, public events: Events, private alertCtrl: AlertController) {
    this.statusBar.hide();
    this.initializeApp();
    this.checkAuthorization();

    let today = moment().format('DD');
    let lastDay = moment().endOf('month').format('DD');
    console.log('Today', today, 'Last day', lastDay);
    if (today === lastDay) {
      this.presentAlert();
    }

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

  openPage(page) {
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page) {
    return page == this.activePage;
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Create Next Budget',
      subTitle: localStorage.nickname + ', it is the last day of the month, Witty is now ready to create your next month budget!',
      buttons: [
        {
          text: 'Remind me later',
          role: 'cancel'
        },
        {
          text: "Let's do it!",
          handler: () => {
            // let modal = this.modalCtrl.create(CreateBudgetPage);
            // modal.present();
            this.nav.setRoot(CreateBudgetPage);
          }
        }
      ]
    });
    alert.present();
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Signing out...',
    });
    this.loading.present();
  }

  logout() {
    this.showLoader();
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

}
