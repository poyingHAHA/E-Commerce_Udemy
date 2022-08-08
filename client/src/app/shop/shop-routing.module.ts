import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

// And we don't actually need the path to the shop inside this route component, which is going to have
// an empty string, the shop component, which is the roots component for our shop module, and we'll just have the id for the product details component.
const routes: Routes = [
  {path: '', component: ShopComponent},
  {path: ':id', component: ProductDetailsComponent}
];

@NgModule({
  declarations: [],
  imports: [
    // We don't need the common module inside our routing module, but we do need to bring in the router module.
    // And this time what we're going to use instead of for root, we want these routes to be loaded up forChild.
    // And that means these routes are not available in our app module and are only going to be available in our shop module.
    RouterModule.forChild(routes)
  ],
  // Now, what we also need to do is export the router module from this, because we're going to want to use this router module inside our shop module.
  exports: [RouterModule]
})
export class ShopRoutingModule { }
