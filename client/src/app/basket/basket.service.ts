import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBasket } from '../shared/models/basket';

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

}
