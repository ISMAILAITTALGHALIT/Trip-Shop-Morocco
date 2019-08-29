import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
  { path: 'category/:catTitle', loadChildren: './category/category.module#CategoryPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'messagerie', loadChildren: './messagerie/messagerie.module#MessageriePageModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartPageModule' },
  { path: 'product-detail/:id', loadChildren: './product-detail/product-detail.module#ProductDetailPageModule' },
  { path: 'create-product', loadChildren: './create-product/create-product.module#CreateProductPageModule' },
  { path: 'edit-product/:id', loadChildren: './edit-product/edit-product.module#EditProductPageModule' },
  { path: 'action-message/:id/:action/:uid', loadChildren: './action-message/action-message.module#ActionMessagePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
