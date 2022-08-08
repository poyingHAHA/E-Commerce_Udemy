import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';

// what we have in here now is we've got our roots array and all of these roots are effectively loaded
// when we first start our application and also if we take a look at our app module. Then all of our modules are declared inside imports
// and are loaded when our app modulates because we're importing these and this is OK, but what we can do is tell Angular not to load everything straight away.
// And if a user just browses to the home page and then disappears somewhere else, do we really want to load up the shop module at the same time?
// So what we'll do is we'll take our two routes, our shop component routes for the shop components and
const routes: Routes = [
  {path: '', component: HomeComponent},
  // we'll do something slightly different with the route for the shop and instead of loading a component here. we'll say is to Load's children.
  // And then we had parentheses and what we want to do is use an import. And then we specify the location of our shop module.
  // This is how we deal with lazy loading. Now our shop module is only going to be activated and loaded when we access the shop path.
  // What this also means is that we can go to our app module. And we no longer need to add the shop module to imports there.
  // And this also means that we no longer need in our shop module to export our shop component because our app module is no longer responsible for loading this particular component.
  // It's our shop module that's now going to be responsible for this, and it already has it in its declarations.
  {path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule)},
  {path: '**', redirectTo: '', pathMatch: 'full'} // redirect to HomeComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
