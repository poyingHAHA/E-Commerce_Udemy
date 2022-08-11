using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppUser : IdentityUser
    {
        // because we've added a couple of properties to the AppUser, And we need to tell our identity context about this AppUser avoids these fields won't be populated inside the table
        public string DisplayName { get; set; }
        public Address address { get; set; }
    }
}