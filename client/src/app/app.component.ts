import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'E-Commerce';

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    const basketid = localStorage.getItem('basket_id');
    if(basketid) {
      this.basketService.getBasket(basketid).subscribe({
        next: res => {
          console.log("initialized basket")
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }
}
