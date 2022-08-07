import { IPagination } from '../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { map, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/'

  constructor(private http:HttpClient) { }

  getProducts(brandId?: number, typeId?: number){
    let params = new HttpParams();
    if(brandId){
      params = params.append('brandId', brandId.toString());
    }

    if(typeId){
      params = params.append('typeId', typeId.toString());
    }
    // What we're doing is we're observing a response and this is going to give us the HTTP response instead
    // of the body of the response, which is what it does automatically.
    // because we're saying we're observing the response here, we actually need to project this data into our actual response. We need to extract the body out of this.
    // We're getting an observable back from the HTTP request. Now we can manipuate this observable And projected into an Ipagination object
    // and what we want to do is get the body of the response and project that into IPagination obj.
    // Now, in order to use our SJS methods, then what we need to do is say we want to pipe the response into something.
    // Now, inside this pipe, we can make use of our rxjs methods.
    return this.http.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
    .pipe( // This pipe is a wrapper around any rxjs operators that we want to use. And inside this pipe method, we can chain as many rxjs operators as we want in this request.
      // for instance, if I wanted to delay the response coming back from for whatever reason that I could add delay, which is rxjs operator, and then
      // I could specify an amount of time to delay the response and add a comma and chain the response onto it.
      // delay(1000),
      map(response => {
        return response.body;
      })
    );
  }

  getBrands(){
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands')
  }

  getTypes(){
    return this.http.get<IType[]>(this.baseUrl + 'products/types')
  }
}
