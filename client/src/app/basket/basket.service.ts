import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  // BehaviorSubject: A variant of Subject tha requires an initial value and emits its current value whenever it is subscribed to.
  // And because it's a behavior subject, then it's always going to emit an initial value.
  private basketSource = new BehaviorSubject<IBasket>(null);
  // Now, this is private, so what we're going to need is a public property that's going to be accessible by other components in our application.
  // So what we'll do is we'll say basket's and to make it clear that this is an observable will add the $ onto it.
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string){
    return this.http.get(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket)
      })
    );
  }

  setBasket(basket: IBasket){
    return this.http.post(this.baseUrl + 'basket', basket).subscribe({
        next: (response: IBasket) => {
          this.basketSource.next(response);
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1){
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id);
    if(index === -1){
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    else{
      items[index].quantity += quantity;
    }

    return items;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    // As long as the user doesn't clear out their local storage, then we'll be able to go and retrieve their baskets.
    // Even if they close the browser, restart their computer, will be able to retrieve this basket because
    // local storage persists even after the browsers closed down or the computer is restarted.
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }
  mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }
}
