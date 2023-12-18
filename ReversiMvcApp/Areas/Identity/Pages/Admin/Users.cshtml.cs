using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ReversiMvcApp.Data;

namespace ReversiMvcApp.Areas.Identity.Pages.Admin
{
    public class UsersModel : PageModel
    {
        private readonly ApplicationDbContext _appDbContext;


        public IEnumerable<IdentityUser> Users { get; set; }
                        = Enumerable.Empty<IdentityUser>();

        public UsersModel(ApplicationDbContext applicationDbContext)
        {
            _appDbContext = applicationDbContext;
        }

        public void OnGet()
        {
            Users = _appDbContext.Users.ToList();
        }
    }
}
