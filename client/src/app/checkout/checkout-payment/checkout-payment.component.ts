import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  submitOrder(){
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutService.createOrder(orderToCreate).subscribe({
      next: (order: IOrder) => {
        this.toastr.success('Order created successfully');
        this.stripe.confirmCardPayment(basket.clientSecret, {
          payment_method: {
            card: this.cardNumber, // using 4242 4242 4242 4242 as the test card number for success payment
            billing_details: {
              name: this.checkoutForm.get('paymentForm').get('nameOnCard').value
            }
          }
        }).then(result => {
          console.log(result);
          if(result.paymentIntent){
            this.basketService.deleteLocalBasket(basket.id);
            const navigationExtras: NavigationExtras = {state: order};
            this.router.navigate(['checkout/success'], navigationExtras);
          }else{
            this.toastr.error('Payment error');
          }
        });
      },
      error: error => {
        this.toastr.error(error.message);
        console.log(error);
      }
    });
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    }
  }

}
