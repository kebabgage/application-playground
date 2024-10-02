using System.Diagnostics;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var Configuration = builder.Configuration;
var ConnectionString = Environment.GetEnvironmentVariable("DOCKER") switch
{
    "true" => "DefaultConnection",
    _ => "LocalhostConnection",
};

var StoragePath = Environment.GetEnvironmentVariable("DOCKER") switch
{
    "true" => Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, @"../files")),
    _ => Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, @"..\..\filesystem\")),
};


builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(Configuration.GetConnectionString(ConnectionString)));

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000", "http://localhost:8080", "http://35.224.146.250");
                          policy.AllowAnyHeader();
                          policy.AllowAnyMethod();
                      });
});


// Just setting the name of XSRF token
builder.Services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();


var app = builder.Build();
Console.WriteLine(StoragePath);

app.UseAuthentication();
app.UseAuthorization();

// Get token endpoint
app.MapGet("antiforgery/token", (IAntiforgery forgeryService, HttpContext context) =>
{
    var tokens = forgeryService.GetAndStoreTokens(context);
    var xsrfToken = tokens.RequestToken!;
    return TypedResults.Content(xsrfToken, "text/plain");
});

app.UseCors(MyAllowSpecificOrigins);

app.UseAntiforgery();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetService<AppDbContext>();

    if (context != null)
    {
        var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
        if (pendingMigrations != null)
        {
            await context.Database.MigrateAsync();
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();

var recipes = app.MapGroup("/recipe");

recipes.MapGet("/", (AppDbContext dbContext) =>
{
    return dbContext.Recipes.OrderBy(r => r.Id).ToList();
});

recipes.MapGet("/{id}", async (int id, AppDbContext dbContext) =>
{
    var recipe = await dbContext.Recipes.FindAsync(id);

    if (recipe is null) return Results.NotFound(id);

    return Results.Ok(recipe);
});


recipes.MapPut("/{id}", async (int id, Recipe inputRecipe, AppDbContext db) =>
{
    var recipe = await db.Recipes.FindAsync(id);

    if (recipe is null) return Results.NotFound();

    recipe.Title = inputRecipe.Title;
    recipe.Description = inputRecipe.Description;

    await db.SaveChangesAsync();

    return Results.Created($"/recipes/{recipe.Id}", recipe);
});

recipes.MapPost("/", (Recipe recipe, AppDbContext dbContext) =>
{
    dbContext.Recipes.Add(recipe);
    dbContext.SaveChanges();

    return Results.Created($"/recipes/{recipe.Id}", recipe);

});


recipes.MapDelete("/{id}", async (int id, AppDbContext dbContext) =>
{
    if (await dbContext.Recipes.FindAsync(id) is Recipe recipe)
    {
        dbContext.Recipes.Remove(recipe);
        await dbContext.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
});

var users = app.MapGroup("/users");

users.MapGet("/", (AppDbContext dbContext) =>
{
    return dbContext.Users.OrderBy(r => r.Id).ToList();
});

users.MapGet("/{id}", async (int id, AppDbContext dbContext) =>
{

    var user = await dbContext.Users.FindAsync(id);

    if (user is null) return Results.NotFound(id);

    return Results.Ok(user);
});

users.MapPost("/", async (User user, AppDbContext dbContext) =>
{
    // Check if we already have someone with this user 
    var userExists = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

    if (userExists == null)
    {
        user.LastLoggedIn = DateTime.UtcNow;
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return Results.Created($"/users/{user.Id}", user);
    }
    else
    {
        // Just incase they login and change their username
        userExists.UserName = user.UserName;
        userExists.LastLoggedIn = DateTime.UtcNow;
        await dbContext.SaveChangesAsync();
        return Results.Created($"/users/{user.Id}", userExists);
    }
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           StoragePath),
    RequestPath = "/images"
});

app.MapPost("/image", async (IFormFile file) =>
{
    if (file.Length > 0)
    {
        var fileName = Path.ChangeExtension(Path.GetRandomFileName(), Path.GetExtension(file.FileName));
        var filePath = Path.Combine(StoragePath, fileName);
        // filePath = Path.ChangeExtension(filePath, Path.GetExtension(file.FileName));

        using var stream = File.Create(filePath);
        await file.CopyToAsync(stream);

        return Results.Created("/image", fileName);
    }

    return Results.NoContent();
}).DisableAntiforgery();


app.Run();
