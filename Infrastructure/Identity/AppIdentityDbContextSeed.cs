using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Edwin",
                    Email = "edwin@test.com",
                    UserName = "edwin@test.com",
                    Address = new Address{
                        FirstName = "Edwin",
                        LastName = "Waku",
                        Street = "53 Lukang",
                        City = "Changhua",
                        State = "TW",
                        ZipCode = "505"
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}