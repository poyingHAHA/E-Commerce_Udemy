import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';



@NgModule({
  declarations: [
    ShopComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ShopComponent // in order to make use of it in app module, we're going to need to export it from here.
  ]
})
export class ShopModule { }
