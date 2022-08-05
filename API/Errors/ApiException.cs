using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiException : ApiResponse
    {
        // which is going to contain the stack trace that we were referring to earlier.
        public string Details { get; set; }
        public ApiException(int statusCode, string message = null, string details = null) : base(statusCode, message)
        {
            this.Details = details;
        }

    }
}