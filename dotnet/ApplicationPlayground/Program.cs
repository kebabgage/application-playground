using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var Configuration = builder.Configuration;
builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();

using (var context = app.Services.GetService<AppDbContext>())
{
    if (context != null)
    {
        await context.Database.MigrateAsync();
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
    Console.WriteLine("LIST /recipes");
    return dbContext.Recipes.OrderBy(r => r.Id).ToList();
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




app.Run();
