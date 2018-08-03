import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddwalletPage } from './addwallet';

@NgModule({
  declarations: [
    AddwalletPage,
  ],
  imports: [
    IonicPageModule.forChild(AddwalletPage),
  ],
})
export class AddwalletPageModule {}
