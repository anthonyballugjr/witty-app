import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletsPage } from './wallets';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  declarations: [
    WalletsPage,

  ],
  imports: [
    IonicPageModule.forChild(WalletsPage),
    NgPipesModule,
  ],
})
export class WalletsPageModule {}
