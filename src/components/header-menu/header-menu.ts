import { Component } from '@angular/core';
import { App, MenuController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

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

  text: string;

  constructor(public menuCtrl: MenuController, public app: App) {
    console.log('Hello HeaderMenuComponent Component');
    this.text = 'Hello World';
  }

  logout() {
    console.log('Logout');
    this.menuCtrl.close();
    this.app.getRootNav().setRoot(LoginPage)
  }

}
