import { IProduct } from '../shared/models/product';
import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: IProduct[];

  constructor(private shopService: ShopService) { }

  ngOnInit() {
    // we have to subscribe so that we actually execute the call to the API, if we don't subscribe nothing happend
    this.shopService.getProducts().subscribe({
      next: response => {
        this.products = response.data;
      },
      error: error => {
        console.log(error);
      }
    })
  }

}
