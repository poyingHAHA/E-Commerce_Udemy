using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
    {
        private readonly StoreContext context;

        public GenericRepository(StoreContext context)
        {
            this.context = context;
        }

        public async Task<T> GetByIdAsync(long id)
        {
            // Set method create a dbDet that can be used to query and save instances of the type of entity for which a set should be return
            return await this.context.Set<T>().FindAsync(id);
        }

        public async Task<IReadOnlyList<T>> ListAllAsync()
        {
            return await this.context.Set<T>().ToListAsync();
        }

        public async Task<T> GetEntityWithSpec(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).ToListAsync();
        }

        public async Task<int> CountAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).CountAsync();
        }
        
        private IQueryable<T> ApplySpecification(ISpecification<T> spec)
        {
            return SpecificationEvaluator<T>.GetQuery(this.context.Set<T>().AsQueryable(), spec);
        }

        public void Add(T entity)
        {
            this.context.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            this.context.Set<T>().Attach(entity);
            // This marks the entity as modified in some way and again, because it's being tracked,
            // It's going to be added to the list of things that need to be saved when safe changes async is called
            this.context.Entry(entity).State = EntityState.Modified;
        }

        public void Delete(T entity)
        {
            this.context.Set<T>().Remove(entity);
        }
    }
}