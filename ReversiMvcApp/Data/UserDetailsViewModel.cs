using Microsoft.AspNetCore.Identity;

namespace ReversiMvcApp.Data
{
    public class UserDetailsViewModel
    {
        public IdentityUser User { get; set; }
        public string Claim { get; set; }
    }
}
