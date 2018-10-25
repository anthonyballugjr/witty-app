import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateBudgetPage } from './create-budget';

@NgModule({
  declarations: [
    CreateBudgetPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateBudgetPage),
  ],
})
export class CreateBudgetPageModule {}
