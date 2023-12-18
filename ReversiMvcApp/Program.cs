using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ReversiMvcApp.Data;
using ReversiMvcApp.Models;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseSqlServer(connectionString));
//builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<ReversiDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("reversiDb")));
builder.Services.AddSingleton(new ReversiRestApiService());

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddControllersWithViews();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy =>
        policy.RequireClaim(ClaimTypes.Role, "Admin"));

    options.AddPolicy("MediatorPolicy", policy =>
        policy.RequireClaim(ClaimTypes.Role, "Mediator", "Admin"));

    options.AddPolicy("SpelerPolicy", policy =>
        policy.RequireClaim(ClaimTypes.Role, "Speler", "Mediator", "Admin"));

    //options.AddPolicy("Speler", policy => policy.RequireClaim("Speler"));
    //options.AddPolicy("Mediator", policy => policy.RequireClaim("Role", "Speler").RequireClaim("Role", "Mediator"));

    //options.AddPolicy("Speler", policy => policy.RequireRole("Speler"));
    //options.AddPolicy("Mediator", policy => policy.RequireRole("Speler", "Mediator"));
    //options.AddPolicy("Beheerder", policy => policy.RequireRole("Speler", "Mediator", "Beheerder"));
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Spel}/{action=Index}/{id?}");
    endpoints.MapRazorPages();
});

//using (var scope = app.Services.CreateScope())
//{
//    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

//    ApplicationRoles.Initialize(dbContext);
//}

app.Run();