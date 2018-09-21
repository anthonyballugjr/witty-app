import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChallengesPage } from './challenges';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [
    ChallengesPage,
  ],
  imports: [
    IonicPageModule.forChild(ChallengesPage),
    NgPipesModule
  ],
})
export class ChallengesPageModule {}
