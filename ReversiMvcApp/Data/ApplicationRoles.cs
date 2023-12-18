using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Data;

namespace ReversiMvcApp.Data
{
    public static class ApplicationRoles
    {
        public enum Roles
        {
            Speler,
            Beheerder,
            Mediator
        }

        public static void Initialize(ApplicationDbContext context)
        {
            AddRoles(context);
        }

        private static void AddRoles(ApplicationDbContext context)
        {
            if (!context.Roles.Any())
            {
                context.Roles.Add(
                new IdentityRole
                    {
                    Name = Roles.Speler.ToString(),
                        NormalizedName = Roles.Speler.ToString().ToUpper()
                    });
                context.Roles.Add(
                new IdentityRole
                {
                    Name = Roles.Beheerder.ToString(),
                        NormalizedName = Roles.Beheerder.ToString().ToUpper()
                    });
                context.Roles.Add(
                    new IdentityRole
                    {
                        Name = Roles.Mediator.ToString(),
                        NormalizedName = Roles.Mediator.ToString().ToUpper()
                    });
                context.SaveChanges();
            }
        }
    }
}
