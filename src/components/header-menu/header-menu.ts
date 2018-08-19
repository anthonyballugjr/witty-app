import { Component } from '@angular/core';
import { App, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { ProfilePage } from '../../pages/profile/profile';
import { MywalletsPage } from '../../pages/mywallets/mywallets';

import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the HeaderMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header-menu',
  templateUrl: 'header-menu.html'
})
export class HeaderMenuComponent {
  loading: any;
  isLoggedIn: boolean = false;

  constructor(public menuCtrl: MenuController, public app: App, public loadingCtrl: LoadingController, private toastCtrl: ToastController, public authProvider: AuthProvider) {
    console.log('Hello HeaderMenuComponent Component');
    // if (!localStorage.getItem('token')) {
    //   this.app.getRootNav().setRoot(LoginPage);
    // }
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
      dismissOnPageChange: true
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  showProfile() {
    this.app.getRootNav().setRoot(ProfilePage);
    this.menuCtrl.close();
  }

  showWallets() {
    this.app.getRootNav().setRoot(MywalletsPage);
    this.menuCtrl.close();
  }

}
