using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReversiMvcApp.Data;
using System.Security.Claims;

namespace ReversiMvcApp.Controllers
{
    [Authorize(Policy = "AdminPolicy")]
    public class RolesController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ReversiDbContext _reversiDbContext;
        public RolesController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, ReversiDbContext reversiDbContext)
        {
            _userManager = userManager;
            _reversiDbContext = reversiDbContext;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _userManager.Users.ToListAsync());
        }

        [HttpGet]
        public async Task<IActionResult> Edit(string Id)
        {
            var user = await _userManager.FindByIdAsync(Id);

            var claims = await _userManager.GetClaimsAsync(user);

            var viewModel = new UserDetailsViewModel
            {
                User = user,
                Claim = claims.FirstOrDefault()?.Value ?? "Geen (niet de bedoeling, tijd voor paniek)"
            };

            return View(viewModel);
        }


        [HttpPost]
        public async Task<IActionResult> Edit(string Id, string Claim)
        {
            var user = await _userManager.FindByIdAsync(Id);

            var claims = await _userManager.GetClaimsAsync(user);

            if (Claim != "Speler" || Claim != "Mediator" || Claim != "Admin" )
            {
                await _userManager.RemoveClaimsAsync(user, claims);
                await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, Claim));

                return await Edit(Id);

            } else
            {
                return await Index();
            }

        }
    }
}