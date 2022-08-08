import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { BreadcrumbModule } from 'xng-breadcrumb';
import {NgxSpinnerModule} from 'ngx-spinner';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    HomeModule,
    BreadcrumbModule,
    NgxSpinnerModule
  ],
  providers: [
    // we need to specify what class we're using for this interceptor, and this is going to be our errorinterceptor that we've just created and make sure this has been brought in correctly.
    // And Angular comes with its own interceptors anyway. And what we're doing here is we're adding this to an array of http interceptors, even though we've only created one of our own.
    // We actually want to add this to a list of HTP interceptors. And what we need to specify is multi. And we'll need to set this to true so the ours isn't the only http interceptor in that list.
    // it's got the ones that come with Angella as well.
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
