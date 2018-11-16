import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewBudgetPage } from './view-budget';

@NgModule({
  declarations: [
    ViewBudgetPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewBudgetPage),
  ],
})
export class ViewBudgetPageModule {}
