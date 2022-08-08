import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit {
  breadcrumb$: Observable<any[]>

  constructor(private bcService: BreadcrumbService) { }

  ngOnInit(): void {
    // And what we also have here is an observable of the breadcrumb itself.
    // Now, there is a general rule of thumb that if you subscribe to something, then you should always unsubscribe from it.
    // In terms of HTTP requests in Angular and HTTP request is considered finite, It has a start and an end. And when the http request response has been completed.
    // Then Angular itself's calls the complete unsubscribed.
    this.breadcrumb$ = this.bcService.breadcrumbs$;
  }

}
