using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IBasketRepository basketRepository;
        private readonly IUnitOfWork unitOfWork;
        private readonly IConfiguration config;

        public PaymentService(IBasketRepository basketRepository, IUnitOfWork unitOfWork, IConfiguration config)
        {
            this.basketRepository = basketRepository;
            this.unitOfWork = unitOfWork;
            this.config = config;
        }

        public async Task<CustomerBasket> CreateOrUpdatePaymentIntent(string basketId)
        {
            StripeConfiguration.ApiKey = this.config["StripeSettings:SecretKey"];

            var basket = await this.basketRepository.GetBasketAsync(basketId);
            var shippingPrice = 0m;

            if(basket.DeliveryMethodId.HasValue)
            {
                var deliveryMethod = await this.unitOfWork.Repository<DeliveryMethod>().GetByIdAsync((long)basket.DeliveryMethodId);
                shippingPrice = deliveryMethod.Price;
            } 

            // check the item price in the basket
            foreach(var item in basket.Items)
            {
                var productItem = await this.unitOfWork.Repository<Core.Entities.Product>().GetByIdAsync(item.Id);
                if(item.Price != productItem.Price)
                {
                    item.Price = productItem.Price;
                }
            }

            var service = new PaymentIntentService();

            PaymentIntent intent;
            if(string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    // And slightly more complex because stripe doesn't take decimals for the amount it takes the number in a long
                    // in order to convert a decimal into a long, then we're going to need to multiply it by a hundred
                    Amount = (long) basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long) shippingPrice * 100,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> {"card"}
                };

                intent = await service.CreateAsync(options);
                basket.PaymentIntentId = intent.Id;
                basket.ClientSecret = intent.ClientSecret;
            }
            else
            { // this takes care of the possibility that the client's been away. They've changed to basket's after going through the check out and then backing out after we've already created a payment intent.
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long) basket.Items.Sum(i => i.Quantity * (i.Price * 100)) + (long) shippingPrice * 100,
                };
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            await this.basketRepository.UpdateBasketAsync(basket);

            return basket;
        }
    }
}