//libraries
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';
import { Facebook } from '@ionic-native/facebook';
//pages
import { HeaderMenuComponent } from '../components/header-menu/header-menu';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { AddwalletPage } from '../pages/addwallet/addwallet';
import { ViewtransactionsPage } from '../pages/viewtransactions/viewtransactions';
//import { ListPage } from '../pages/list/list';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { CategoriesPage } from '../pages/categories/categories';
import { ChallengesPage } from '../pages/challenges/challenges';
//providers
import { CategoryProvider } from '../providers/category/category';
import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    LoginPage,
    SignupPage,
    AddwalletPage,
    ProfilePage,
    CategoriesPage,
    ViewtransactionsPage,
    ChallengesPage,
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
    TabsPage,
    HomePage,
    SignupPage,
    LoginPage,
    AddwalletPage,
    ProfilePage,
    CategoriesPage,
    ChallengesPage,
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
