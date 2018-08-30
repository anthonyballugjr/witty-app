//libraries
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';
import { Facebook } from '@ionic-native/facebook';
import { Calendar } from '@ionic-native/calendar';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NgCalendarModule } from 'ionic2-calendar';
//pages
import { HeaderMenuComponent } from '../components/header-menu/header-menu';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { AddwalletPage } from '../pages/addwallet/addwallet';
import { ViewtransactionsPage } from '../pages/viewtransactions/viewtransactions';
import { NotificationsPage } from '../pages/notifications/notifications';
//import { ListPage } from '../pages/list/list';
import { ProfilePage } from '../pages/profile/profile';
import { CategoriesPage } from '../pages/categories/categories';
import { MywalletsPage } from '../pages/mywallets/mywallets';
import { BillsPage } from '../pages/bills/bills';
import { AddBillPage } from '../pages/add-bill/add-bill';
import { EditWalletPage} from '../pages/edit-wallet/edit-wallet';
//providers
import { CategoryProvider } from '../providers/category/category';
import { AuthProvider } from '../providers/auth/auth';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { SuperTabsModule } from '../../node_modules/ionic2-super-tabs';
// notification plugin



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    AddwalletPage,
    ProfilePage,
    CategoriesPage,
    ViewtransactionsPage,
    MywalletsPage,
    HeaderMenuComponent,
    NotificationsPage,
    AddBillPage,
    BillsPage,
    EditWalletPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgPipesModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    LoginPage,
    AddwalletPage,
    ProfilePage,
    CategoriesPage,
    MywalletsPage,
    ViewtransactionsPage,
    NotificationsPage,
    AddBillPage,
    BillsPage,
    EditWalletPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    CategoryProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    LocalNotifications,
    Calendar,
    NotificationsProvider
  ]
})
export class AppModule { }
