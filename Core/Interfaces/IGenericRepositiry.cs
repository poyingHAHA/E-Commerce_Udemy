using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IGenericRepositiry<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(long id);
        Task<IReadOnlyList<T>> ListAllAsync();
    }
}