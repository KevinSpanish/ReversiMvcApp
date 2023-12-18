using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ReversiMvcApp.Data;
using ReversiMvcApp.Models;

namespace ReversiMvcApp.Controllers
{
    [Authorize]
    public class SpelController : Controller
    {
        private readonly ReversiRestApiService _service;
        private readonly ReversiDbContext _context;

        public SpelController(ReversiRestApiService service, ReversiDbContext context)
        {
            _service = service;
            _context = context;
        }

        // GET: Spel
        [Authorize(Policy = "SpelerPolicy")]
        public IActionResult Index()
        {

            ClaimsPrincipal currentUser = this.User;
            var currentUserId = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Spel spel = _service.GetGameByPlayer(currentUserId);

            if (spel != null)
            {
                return RedirectToAction(nameof(Game), new { spelToken = spel.Token });
            }

            return View(_service.GetGamesPending());
        }

        // GET: Spel/Details/5
        public IActionResult Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            Spel spel = _service.GetGame(id);

            if (spel == null)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                ClaimsPrincipal currentUser = this.User;
                var currentUserId = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                spel = _service.CreateGame(currentUserId, spel.Omschrijving);
                return RedirectToAction(nameof(Details), new { spelToken = spel.Token });
            }

            return View(_service.GetGamesPending());
        }

        // GET: Spel/Create
        public IActionResult Create()
        {
            ClaimsPrincipal currentUser = this.User;
            var currentUserId = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Spel spel = _service.GetGameByPlayer(currentUserId);

            if (spel != null)
            {
                return RedirectToAction(nameof(Game), new { spelToken = spel.Token });
            }

            return View();
        }

        [HttpPost("Create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateGame([FromForm] string Speler1Token, string Omschrijving)
        {
            ClaimsPrincipal currentUser = this.User;
            var currentUserID = currentUser.FindFirst(ClaimTypes.NameIdentifier).Value;

            var result = _service.CreateGame(Speler1Token, Omschrijving);
            if (result != null)
            {
                return RedirectToAction(nameof(Create));
            }

            //Should probably go to Game instead of Details at a later stage.
            return Redirect($"/spel/details/{result.Token}");
        }

        public IActionResult Join(string spelToken)
        {
            if (spelToken == null)
            {
                return NotFound();
            }

            ClaimsPrincipal currentUser = this.User;
            var currentUserId = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Spel spel = _service.JoinGame(spelToken, currentUserId);

            return RedirectToAction(nameof(Game), new { spelToken = spel.Token });
        }

        public IActionResult Game(string spelToken)
        {
            if (spelToken == null)
            {
                return RedirectToAction(nameof(Index));
            }

            Spel spel = _service.GetGame(spelToken);

            if (spel == null)
            {
                return RedirectToAction(nameof(Index));
            }

            return View(spel);
        }

        [HttpPost("Leave")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Leave(string token)
        {
            string spelToken = token;
            if (spelToken == null) return RedirectToAction(nameof(Index));

            Spel spel = _service.GetGame(spelToken);
            if (spel == null) return RedirectToAction(nameof(Index));

            ClaimsPrincipal currentUser = this.User;
            var currentUserId = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Speler speler1 = _context.Spelers.FirstOrDefault(s => s.Guid == spel.Speler1Token);
            if (speler1 == null) return NotFound();

            if (spel.Speler2Token == null)
            {
                if (!_service.Delete(spelToken)) return BadRequest();

                return RedirectToAction(nameof(Index));
            }

            Speler speler2 = _context.Spelers.First(s => s.Guid == spel.Speler2Token);
            if (speler2 == null) return NotFound();


            if (currentUserId == speler1.Guid)
            {
                //Player 1 ditches
                speler2.AantalGewonnen++;
                speler1.AantalVerloren++;
            }
            else if (currentUserId == speler2.Guid)
            {
                //Player 2 ditches
                speler1.AantalGewonnen++;
                speler2.AantalVerloren++;
            }

            await _context.SaveChangesAsync();

            if (!_service.Delete(spelToken)) return BadRequest();

            return RedirectToAction(nameof(Index));

        }

        [AllowAnonymous]
        [HttpPost("Spel/Done/{spelToken}")]
        public async Task<IActionResult> Done(string spelToken)
        {
            if (spelToken == null) return NotFound();

            Spel spel = _service.GetGame(spelToken);
            if (spel == null) return NotFound();

            ClaimsPrincipal currentUser = this.User;
            var currentUserId = currentUser.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            Speler speler1 = _context.Spelers.FirstOrDefault(s => s.Guid == spel.Speler1Token);
            if (speler1 == null) return NotFound();

            Speler speler2 = _context.Spelers.FirstOrDefault(s => s.Guid == spel.Speler2Token);
            if (speler2 == null) return NotFound();

            if (spel.Gewonnen != "")
            {
                if (spel.Gewonnen == "1") // Wit gewonnen
                {
                    speler1.AantalGewonnen++;
                    speler2.AantalVerloren++;
                }
                else if (spel.Gewonnen == "2") // Zwart gewonnen
                {
                    speler2.AantalGewonnen++;
                    speler1.AantalVerloren++;
                }
                else
                {
                    speler1.AantalGelijk++;
                    speler2.AantalGelijk++;
                }
            }

            await _context.SaveChangesAsync();

            if (!_service.Delete(spelToken)) return BadRequest();

            return Ok(spelToken);
        }
    }
}
