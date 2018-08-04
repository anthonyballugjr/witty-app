import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HeaderMenuComponent } from '../components/header-menu/header-menu';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { AddwalletPage } from '../pages/addwallet/addwallet';
import { ViewtransactionsPage } from '../pages/viewtransactions/viewtransactions';
//import { ListPage } from '../pages/list/list';

import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';
import { Facebook } from '@ionic-native/facebook';

import { CategoryProvider } from '../providers/category/category';
import { AuthProvider } from '../providers/auth/auth';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    AddwalletPage,
    ViewtransactionsPage,
    HeaderMenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgPipesModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    LoginPage,
    AddwalletPage,
    ViewtransactionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    CategoryProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider
  ]
})
export class AppModule { }
