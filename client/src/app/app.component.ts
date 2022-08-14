import { AccountService } from 'src/app/account/account.service';
import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'E-Commerce';

  constructor(private basketService: BasketService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadBasket();
    this.loadCurrentUser();
  }

  loadCurrentUser(){
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token).subscribe({
        next: () => console.log('loaded user'),
        error: error => console.log(error)
    })
  }

  loadBasket(){
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
