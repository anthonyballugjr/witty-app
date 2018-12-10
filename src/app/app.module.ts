//libraries
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { NgPipesModule } from 'ngx-pipes';
import { Facebook } from '@ionic-native/facebook';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { TooltipsModule } from 'ionic-tooltips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Network } from '@ionic-native/network';
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
import { CreateBudgetPage } from '../pages/create-budget/create-budget';
import { ViewDepositsPage } from '../pages/view-deposits/view-deposits';
import { BudgetsPage } from '../pages/budgets/budgets';
import { ViewBudgetPage } from '../pages/view-budget/view-budget';
import { PredictionPage } from '../pages/prediction/prediction';
import { SummaryReportPage } from '../pages/summary-report/summary-report';
//providers
import { CategoryProvider } from '../providers/category/category';
import { AuthProvider } from '../providers/auth/auth';
import { PopovermenuComponent } from '../components/popovermenu/popovermenu';
import { ReportsProvider } from '../providers/reports/reports';
import { SavingsProvider } from '../providers/savings/savings';
import { ExpensesProvider } from '../providers/expenses/expenses';
import { TransactionsProvider } from '../providers/transactions/transactions';
import { DepositsProvider } from '../providers/deposits/deposits';
//pipes
import { SearchPipe } from '../pipes/search/search';
import { SortPipe } from '../pipes/sort/sort';
import { GroupByPipe } from '../pipes/group-by/group-by';
import { NetworkProvider } from '../providers/network/network';



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
    BudgetsPage,
    ChallengesPage,
    MywalletsPage,
    PopovermenuComponent,
    BillsPage,
    EditWalletPage,
    BudgetOverviewPage,
    ExpensesPage,
    ChangePasswordPage,
    ViewArchivePage,
    CreateBudgetPage,
    ViewDepositsPage,
    ViewBudgetPage,
    PredictionPage,
    SummaryReportPage,
    SearchPipe,
    SortPipe,
    GroupByPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgPipesModule,
    TooltipsModule,
    BrowserAnimationsModule,
    RoundProgressModule,
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
    ViewArchivePage,
    CreateBudgetPage,
    BudgetsPage,
    ViewDepositsPage,
    ViewBudgetPage,
    PredictionPage,
    SummaryReportPage
  ],
  providers: [
    Network,
    StatusBar,
    File,
    FileOpener,
    AndroidFullScreen,
    SplashScreen,
    ScreenOrientation,
    Facebook,
    CategoryProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    LocalNotifications,
    ReportsProvider,
    SavingsProvider,
    ExpensesProvider,
    TransactionsProvider,
    DepositsProvider,
    NetworkProvider,
  ]
})
export class AppModule { }
