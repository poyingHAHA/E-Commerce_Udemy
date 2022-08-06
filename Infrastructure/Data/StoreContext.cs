using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        // the prop name Products will be the table name in the database
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBrand> ProductBrands{ get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }

        public StoreContext(DbContextOptions<StoreContext> options) : base(options)
        {
        }

        // that is responsible for creating that migration. So what we're going to do is override this method and tell it to look for our configurations.
        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // 因為sqlite不支持decimal但是我們的價錢是用decimal的形式，所以需要判斷當前資料庫的類型來做轉換
            if(Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            {
                foreach(var entityType in modelBuilder.Model.GetEntityTypes())
                {
                    var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));

                    foreach (var property in properties)
                    {
                        modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                    }
                }
            }
        }
    }
}