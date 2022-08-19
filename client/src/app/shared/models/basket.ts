import {v4 as uuidv4} from 'uuid'

export interface IBasketItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  pictureUrl: string;
  brand: string;
  type: string;
}

export interface IBasket {
  id: string;
  items: IBasketItem[];
  clientSecret?: string;
  paymentIntentId?: string;
  deliveryMethodId?: number;
}

export class Basket implements IBasket{
  // whenever we create a new instance of the basket, it's going to have a unique identifier and it's going to have an empty array of items.
  id = uuidv4();
  items: IBasketItem[] = [];
}

export interface IBasketTotals{
  shipping: number;
  subTotal: number;
  total: number;
}
