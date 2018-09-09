import { NgModule } from '@angular/core';
import { HeaderMenuComponent } from './header-menu/header-menu';
import { PopovermenuComponent } from './popovermenu/popovermenu';

@NgModule({
	declarations: [HeaderMenuComponent,
    PopovermenuComponent],
	imports: [],
	exports: [HeaderMenuComponent,
    PopovermenuComponent]
})
export class ComponentsModule {}
