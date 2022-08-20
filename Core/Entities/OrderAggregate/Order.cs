using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order()
        {
        }

        public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail, Address shipToAddress, DeliveryMethod deliveryMethod, decimal subtotal, string paymentIntentId)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
            PaymentIntentId = paymentIntentId;
        }

        public string BuyerEmail { get; set; }
        public DateTimeOffset OrderDate { get; set; } = DateTimeOffset.Now;
        public Address ShipToAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public OrderStatus Status { get; set;} = OrderStatus.Pending;
        // we can use this to check to see if there's already an order before we go ahead and try and create a new one with the same payment intented as we don't
        // want multiple orders in our database with the same payment intent. This is a unique number, although we're not enforcing uniqueness on our server for this. 
        public string? PaymentIntentId { get; set; }

        // If Automapper sees something called get+whatever, then it s also going to run this code inside here 
        // and get the total and populate that into a property called Total.
        public decimal GetTotal()
        {
            return Subtotal + DeliveryMethod.Price;
        }
    }
}