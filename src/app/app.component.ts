import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { Events } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';;
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { MywalletsPage } from '../pages/mywallets/mywallets';
import { CategoriesPage } from '../pages/categories/categories';
import { BudgetsPage } from '../pages/budgets/budgets';
import { AuthProvider } from '../providers/auth/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  isLoggedIn: boolean = false;

  nickname: string;
  activePage: any;
  loading: any;

  checkAuthorization(): void {
    if ((localStorage.getItem('token') === null || localStorage.getItem('token') === 'undefined' || localStorage.getItem('token') === '')) {
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


  constructor(public fullScreen: AndroidFullScreen, public app: App, public menuCtrl: MenuController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, public authProvider: AuthProvider, public platform: Platform, public splashScreen: SplashScreen, public statusBar: StatusBar, public events: Events) {

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
      { title: 'Manage Wallets', icon: 'list-box', component: CategoriesPage }
      { title: 'Playground', icon: 'baseball', component: MywalletsPage }
    ];
    this.activePage = this.pages[0];
  }

  async onStart() {
    await this.statusBar.hide();
    await this.initializeApp();
    await this.checkAuthorization();
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

  showLoader(msg) {
    this.loading = this.loadingCtrl.create({
      content: `<div>
      <div class="loader"><img src="../../assets/imgs/logo.gif"/ height="100px"></div>
      <p>C${msg}</p>
      </div>`,
      spinner: 'hide'
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
