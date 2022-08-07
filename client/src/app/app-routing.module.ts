import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'shop/:id', component: ProductDetailsComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'} // redirect to HomeComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
