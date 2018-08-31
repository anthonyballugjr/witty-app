import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BudgetOverviewPage } from './budget-overview';

@NgModule({
  declarations: [
    BudgetOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(BudgetOverviewPage),
  ],
})
export class BudgetOverviewPageModule {}
