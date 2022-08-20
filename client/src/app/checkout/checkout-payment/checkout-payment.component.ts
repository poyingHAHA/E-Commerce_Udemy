import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IOrder } from 'src/app/shared/models/order';
import { CheckoutService } from '../checkout.service';

// And we do this so that we don't get any complaints inside here.
declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  // get access to the template reference variables we created
  // the static is true in this case, we're not going to be attempting to use ngIf for any structural components on this.
  @ViewChild('cardNumber', {static: true}) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', {static: true}) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', {static: true}) cardCvcElement: ElementRef;
  stripe: any;
  cardNumber: any;
  cardCvc: any;
  cardExpiry: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);
  // we're going to use this as an indication of when things have started and when things are finished.
  loading = false;

  constructor(private basketService: BasketService, private checkoutService: CheckoutService, private toastr: ToastrService, private router: Router) { }

  // this gives our HTML a chance to initialize and then we can mount the strip elements on top of them.
  ngAfterViewInit() {
    // paste in publishable key
    this.stripe = Stripe('pk_test_51LYPfNKJgqG7raYbDj3cNanH9xjDu0RTaylhDaaR1ioIYDRktxlwZoGdRWgD3UfnJlJ0QD5K14izxyoHnOxklkyO00K1KmCTZg');
    const elements = this.stripe.elements();

    // this is stripe's element functionality
    // we mount's the stripe elements onto our native cardNumberElement on our HTML page
    this.cardNumber = elements.create('cardNumber')
    this.cardNumber.mount(this.cardNumberElement.nativeElement)
    // So each one of these is going to have its own event listener looking for any changes inside this particular element,
    // and we're going to use our carHandler, which is going to call onChange event. And if we get any errors, then it's going to populate the this.cardErrors.
    this.cardNumber.addEventListener('change', this.cardHandler)

    this.cardExpiry = elements.create('cardExpiry')
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement)
    this.cardExpiry.addEventListener('change', this.cardHandler)


    this.cardCvc = elements.create('cardCvc')
    this.cardCvc.mount(this.cardCvcElement.nativeElement)
    this.cardCvc.addEventListener('change', this.cardHandler)

  }

  // what we want to do is, is dispose of what we're creating in here when the components is disposed of as well.
  ngOnDestroy(){
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }

  // this is known as Destructuring
  // So unchange is going to receive an object of some description. And inside that object is going to be a property called error.
  // And that property is the one we're interested in.
  onChange({error}) {
    if(error){
      this.cardErrors = error.message;
    }else{
      this.cardErrors = null;
    }
  }

  async submitOrder(){
    this.loading = true;
    const basket = this.basketService.getCurrentBasketValue();
    try {
      const createOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentWithStripe(basket);

      if(paymentResult.paymentIntent){
        this.basketService.deleteLocalBasket(basket.id);
        const navigationExtras: NavigationExtras = {state: createOrder};
        this.router.navigate(['checkout/success'], navigationExtras);
      }else{
        this.toastr.error(paymentResult.error.message);
      }
      this.loading = false;
    } catch (error) {
      console.log(error)
      this.loading = false;
    }
  }

  private async confirmPaymentWithStripe(basket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber, // using 4242 4242 4242 4242 as the test card number for success payment
        billing_details: {
          name: this.checkoutForm.get('paymentForm').get('nameOnCard').value
        }
      }
    });
  }

  private async createOrder(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket);
    return lastValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    }
  }

}
