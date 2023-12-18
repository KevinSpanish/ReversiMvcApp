using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReversiMvcApp.Data;
using ReversiMvcApp.Models;
using System.Diagnostics;
using System.Security.Claims;

namespace ReversiMvcApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private ReversiDbContext _context;
        public HomeController(ILogger<HomeController> logger, ReversiDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("Test")]
        public async Task<IActionResult> Test()
        {
            return Ok("Testje");
        }

        [Authorize]
        public IActionResult Index()
        {
            ClaimsPrincipal currentUser = this.User;
            var currentUserId = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = currentUser.FindFirstValue(ClaimTypes.Name);
            var role = currentUser.FindFirstValue(ClaimTypes.Role);

            if (currentUserId != null)
            {
                Speler speler = _context.Spelers.FirstOrDefault(s => s.Guid == currentUserId);
                if (speler == null)
                {
                    speler = new Speler
                    {
                        Guid = currentUserId,
                        Naam = userName,
                        //Role = role,
                    };
                    _context.Spelers.Add(speler);
                    _context.SaveChanges();
                }
            }

            return View();
        }

        [Authorize]
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}