import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MywalletsPage } from './mywallets';

@NgModule({
  declarations: [
    MywalletsPage,
  ],
  imports: [
    IonicPageModule.forChild(MywalletsPage),
  ],
})
export class MywalletsPageModule {}
