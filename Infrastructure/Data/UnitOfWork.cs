using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext context;
        // Any repository we use that we use inside this unit of work are going to be stored inside this hash table
        // Now we can have single repository or we could have 100 repositories.
        private Hashtable repositories;

        public UnitOfWork(StoreContext context)
        {
            this.context = context;
        }

        public async Task<int> Complete()
        {
            return await this.context.SaveChangesAsync();
        }

        public void Dispose()
        {
            this.context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            // first of all , we want to see if we have anything inside our hash table
            if(this.repositories == null) this.repositories = new Hashtable();
            
            // and we want to get the name of the entity and see what this actually is.
            var type = typeof(TEntity).Name;
            
            // then we're going to check if our hash table contains an entry fot the entity with this specific name.
            if(!this.repositories.ContainsKey(type))
            {
                var repositoryType = typeof(GenericRepository<>);
                // Rather than using or creating an instance of our context
                // when we create our repository, we are going to be passing in the context to our units of work owners as a parameter into that repository
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), this.context);
                this.repositories.Add(type, repositoryInstance);
            }

            return (IGenericRepository<TEntity>) this.repositories[type];
        }
    }
}