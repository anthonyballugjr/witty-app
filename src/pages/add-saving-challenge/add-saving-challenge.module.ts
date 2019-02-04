import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSavingChallengePage } from './add-saving-challenge';

@NgModule({
  declarations: [
    AddSavingChallengePage,
  ],
  imports: [
    IonicPageModule.forChild(AddSavingChallengePage),
  ],
})
export class AddSavingChallengePageModule {}
