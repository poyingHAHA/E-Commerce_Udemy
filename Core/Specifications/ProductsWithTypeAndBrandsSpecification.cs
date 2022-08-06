using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithTypeAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductsWithTypeAndBrandsSpecification(string sort, int? brandId, int? typeId) 
        : base(x => // 加!基本上沒太大意義，但是可以增加效能，因為如果值是null就可以不用執行||後面的語句
            (!brandId.HasValue || x.ProductBrandId == brandId) && (!typeId.HasValue || x.ProductTypeId == typeId) 
        )
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
            AddOrderBy(x => x.Name);

            if(!string.IsNullOrEmpty(sort))
            {
                switch(sort)
                {
                    case "priceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(n => n.Name);
                        break;
                }
            }
        }

        public ProductsWithTypeAndBrandsSpecification(long id) : base(x => x.Id == id)
        {
            AddInclude(x => x.ProductType);
            AddInclude(x => x.ProductBrand);
        }
    }
}