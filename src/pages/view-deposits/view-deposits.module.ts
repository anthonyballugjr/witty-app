import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewDepositsPage } from './view-deposits';

@NgModule({
  declarations: [
    ViewDepositsPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewDepositsPage),
  ],
})
export class ViewDepositsPageModule {}
