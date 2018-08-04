import { Component } from '@angular/core';
import { App, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
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

  logout() {
    this.authProvider.logout().then((result) => {
      this.menuCtrl.close();
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

}
