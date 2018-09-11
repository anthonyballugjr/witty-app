import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { TabsPage } from '../pages/tabs/tabs';;
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { MywalletsPage } from '../pages/mywallets/mywallets';

import { AuthProvider } from '../providers/auth/auth';
import { CategoriesPage } from '../pages/categories/categories';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  loading: any;

  checkAuthorization(): void {
    if ((localStorage.getItem('token') === null || localStorage.getItem('token') === 'undefined')) {
      this.rootPage = LoginPage;
    } else {
      this.rootPage = TabsPage;
    }
  }

  //rootPage: any = LoginPage;

  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public app: App, public menuCtrl: MenuController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, public authProvider: AuthProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.checkAuthorization();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', icon: 'home', component: TabsPage },
      { title: 'Profile', icon: 'person', component: ProfilePage },
      { title: 'Manage Wallets', icon: 'list-box', component: CategoriesPage },
      { title: 'My Debug Page', icon: 'baseball', component: MywalletsPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(()=>{
        this.splashScreen.hide();
      }, 300)
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
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
      this.presentToast('Signed Out');
    }, (err) => {
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle',
      dismissOnPageChange: false
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}
