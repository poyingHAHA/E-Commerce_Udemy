using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    public class DeliveryMethod : BaseEntity
    {
        public string shortName { get; set; }
        public string DeliveryTime { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
    }
}