import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;

  // ActivatedRoute gives us access to the routes parameters so we can get the routes that we're activating and use this information to pass it as the id of the product to our API.
  constructor(private shopService: ShopService, private activatedRoute: ActivatedRoute, private bcService: BreadcrumbService) { }

  ngOnInit(): void {
    this.loadProduct()
  }

  loadProduct(){
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe({
      next: product => {
        this.product = product;
        this.bcService.set('@productDetails', product.name);
      },
      error: error => {console.log(error)}
    })
  }

}
