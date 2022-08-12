using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext context;

        public BuggyController(StoreContext context)
        {
            this.context = context;
        }

        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest()
        {
            var thing = this.context.Products.Find((long)42);

            if(thing == null)
            {
                return NotFound(new ApiResponse(404));
            }

            return Ok();
        }

        [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            var thing = this.context.Products.Find((long)42);

            var thingToReturn = thing.ToString();

            return Ok();
        }

        [HttpGet("badRequest")]
        public ActionResult GetBadRequest()
        {
            return BadRequest(new ApiResponse(400));
        }

        [HttpGet("badRequest/{id}")]
        public ActionResult GetNotFoundRequest(long id)
        {
            return Ok();
        }

        [HttpGet("testauth")]
        [Authorize] // we won't be able to access this unless we send a valid JWT token to our server. It's going to validate the signature is going to validate the issuer.
        public ActionResult<string> GetSecretText()
        {
            return "secret stuff";
        }

    }
}