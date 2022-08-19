import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
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
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping = 0

  constructor(private http: HttpClient) { }

  setShippingPrice(deliveryMethod: IDeliveryMethod){
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    this.calculateTotals();
    this.setBasket(basket); 
  }

  getBasket(id: string){
    return this.http.get(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      })
    );
  }

  setBasket(basket: IBasket){
    return this.http.post(this.baseUrl + 'basket', basket).subscribe({
        next: (response: IBasket) => {
          this.basketSource.next(response);
          this.calculateTotals();
        },
        error: error => {
          console.log(error);
        }
      }
    )
  }

  getCurrentBasketValue(){
    // A Subject or Observable doesn't have a current value. When a value is emitted, it is passed to subscribers and the Observable is done with it.
    // If you want to have a current value, use BehaviorSubject which is designed for exactly that purpose.
    // BehaviorSubject keeps the last emitted value and emits it immediately to new subscribers.
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1){
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if(basket.items[foundItemIndex].quantity > 1){
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    }else{
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if(basket.items.some(x => x.id === item.id)){
      basket.items = basket.items.filter(i => i.id !== item.id);
      if(basket.items.length > 0){
        this.setBasket(basket);
      } else{
        this.deleteBasket(basket);
      }
    }
  }

  deleteLocalBasket(id: string){
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' +basket.id).subscribe({
      next: () => {
          this.basketSource.next(null);
          this.basketTotalSource.next(null);
          localStorage.removeItem('basket_id');
      },
      error: error => console.log(error)
    })
  }

  private calculateTotals(){
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subTotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subTotal + shipping;
    this.basketTotalSource.next({shipping, total, subTotal});
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    // console.log(items)
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
