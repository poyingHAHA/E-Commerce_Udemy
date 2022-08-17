using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository basketRepo;
        private readonly IUnitOfWork unitOfWork;

        public OrderService(IBasketRepository basketRepo, IUnitOfWork unitOfWork)
        {
            
            this.basketRepo = basketRepo;
            this.unitOfWork = unitOfWork;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, long deliveryMethodId, string basketId, Address shoppingAddress)
        {
            // get basket from the repo
            var basket = await this.basketRepo.GetBasketAsync(basketId);
            
            // get items from the product report
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                var productItem = await this.unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }
            // get delivery method from repo
            var deliveryMethod = await this.unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            // calc subtotal
            var subtotal = items.Sum(i => i.Price * i.Quantity);

            // create order
            var order = new Order(items, buyerEmail, shoppingAddress, deliveryMethod, subtotal);
            this.unitOfWork.Repository<Order>().Add(order);

            // TODO: save to db
            // Because our unit od work owns our context, any changes that attracts by entity framework are going to be saved into a database at this point.
            var result = await this.unitOfWork.Complete();
            // So what we guarantee in this unit of work is that all of changes in this method are going to be applied or none of then are.
            
            if(result <= 0) // means nothing saved to the database
            {
                return null;
            }

            // delete basket
            await this.basketRepo.DeleteBasketAsync(basketId);

            // return order
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await this.unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(long id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
            return await this.unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await this.unitOfWork.Repository<Order>().ListAsync(spec);
        }
    }
}