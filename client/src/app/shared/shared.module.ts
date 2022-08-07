import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';

@NgModule({
  declarations: [
    PagingHeaderComponent
  ],
  imports: [
    CommonModule,
    // anything that we add to our shared module, we also need to export because we're going to be importing
    // our shared module into any feature modules that need the functionality that we're providing inside thisshared module.
    PaginationModule.forRoot()
    // Now we need to add foRoot here as the pagination module has its own provider's array and
    // those providers need to be injected into our root module at startup. And if we take off the four routes,
    // then it won't load with its providers and will have errors.
  ],
  exports: [
    PaginationModule,
    PagingHeaderComponent
  ]
})
export class SharedModule { }
