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
import { SuperTabsModule } from 'ionic2-super-tabs';
import { File } from '@ionic-native/file';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
//pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { LoginPage } from '../pages/login/login';
import { AddwalletPage } from '../pages/addwallet/addwallet';
import { ViewtransactionsPage } from '../pages/viewtransactions/viewtransactions';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { CategoriesPage } from '../pages/categories/categories';
import { ChallengesPage } from '../pages/challenges/challenges';
import { MywalletsPage } from '../pages/mywallets/mywallets';
import { BillsPage } from '../pages/bills/bills';
import { EditWalletPage } from '../pages/edit-wallet/edit-wallet';
import { BudgetOverviewPage } from '../pages/budget-overview/budget-overview';
import { ExpensesPage } from '../pages/expenses/expenses';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { ViewArchivePage } from '../pages/view-archive/view-archive';
//providers
import { CategoryProvider } from '../providers/category/category';
import { AuthProvider } from '../providers/auth/auth';
import { PopovermenuComponent } from '../components/popovermenu/popovermenu';
import { ReportsProvider } from '../providers/reports/reports';
import { SearchPipe } from '../pipes/search/search';
import { SortPipe } from '../pipes/sort/sort';
import { GroupByPipe } from '../pipes/group-by/group-by';




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
    MywalletsPage,
    PopovermenuComponent,
    BillsPage,
    EditWalletPage,
    BudgetOverviewPage,
    ExpensesPage,
    ChangePasswordPage,
    ViewArchivePage,
    SearchPipe,
    SortPipe,
    GroupByPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgPipesModule,
    NgCalendarModule,
    TooltipsModule,
    BrowserAnimationsModule,
    SuperTabsModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      navExitApp: false
    })
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
    MywalletsPage,
    ViewtransactionsPage,
    BillsPage,
    EditWalletPage,
    BudgetOverviewPage,
    ExpensesPage,
    PopovermenuComponent,
    ChangePasswordPage,
    ViewArchivePage
  ],
  providers: [
    StatusBar,
    File,
    AndroidFullScreen,
    SplashScreen,
    Facebook,
    CategoryProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    LocalNotifications,
    Calendar,
    ReportsProvider,
  ]
})
export class AppModule { }
