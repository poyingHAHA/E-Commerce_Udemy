import { IProduct } from '../shared/models/product';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  // our search input's, property or field, is a child of our shop component.
  // It's in our template and we want to access this particular input from the shop component.
  @ViewChild('search', {static: true}) searchTerm: ElementRef; // in this case, we are going to specify that this is a static element that's not relying on any dynamic activity.
  products: IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    {name: 'Alphabetibal', value: 'name'},
    {name: 'Price: Low to High', value: 'priceAsc'},
    {name: 'Price: High to Loww', value: 'priceDesc'}
  ]

  constructor(private shopService: ShopService) { }

  ngOnInit() {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => {
        console.log(response)
        this.products = response.data;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getBrands(){
    this.shopService.getBrands().subscribe({
      next: response => {
        this.brands = [{id: 0, name: 'All'}, ...response];
      },
      error: error => {
        console.log(error);
      }
    })
  }

  getTypes(){
    this.shopService.getTypes().subscribe({
      next: response => {
        this.types = [{id: 0, name: 'All'}, ...response];
      },
      error: error => {
        console.log(error);
      }
    })
  }

  onBrandSelected(brandId: number){
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(sort: string){
     this.shopParams.sort = sort;
     this.getProducts();
  }

  onPageChanged(event: any){
    this.shopParams.pageNumber = event;
    this.getProducts();
  }

  onSearch(){
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.getProducts();
  }

  onReset(){
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
