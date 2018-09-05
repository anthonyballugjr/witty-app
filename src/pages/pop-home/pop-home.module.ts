import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopHomePage } from './pop-home';

@NgModule({
  declarations: [
    PopHomePage,
  ],
  imports: [
    IonicPageModule.forChild(PopHomePage),
  ],
})
export class PopHomePageModule {}
