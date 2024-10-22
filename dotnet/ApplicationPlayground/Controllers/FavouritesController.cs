using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.VisualBasic;


public class GetFavouritesRequest
{
    public int? UserId { get; set; }
    public int? RecipeId { get; set; }
}

public class CreateFavouriteRequest
{
    public int UserId { get; set; }
    public int RecipeId { get; set; }
}

public static class FavouritesController
{

    public static async Task<IResult> GetFavouriteByUserAndRecipe(int userId, int recipeId, AppDbContext dbContext)
    {
        var item = dbContext.Favourites.Where(f => f.User.Id == userId && f.Recipe.Id == recipeId).FirstOrDefault();

        if (item == null)
        {
            return Results.NotFound();
        }
        else
        {
            return Results.Ok(item);
        }
    }

    // [HttpGet]
    public static async Task<IResult> GetFavourites(AppDbContext dbContext)
    {
        return Results.Ok(dbContext.Favourites.Include(f => f.User).Include(f => f.Recipe));
    }

    public static async Task<IResult> GetFavouritesForUser(int userId, AppDbContext dbContext)
    {
        return Results.Ok(dbContext.Favourites.Where(f => f.User.Id == userId).Include(f => f.Recipe).Include(f => f.Recipe.User).Include(f => f.User));
    }

    [HttpDelete]
    public async static Task<IResult> DeleteFavourite(int id, AppDbContext dbContext)
    {
        if (await dbContext.Favourites.FindAsync(id) is Favourite recipe)
        {
            dbContext.Favourites.Remove(recipe);
            await dbContext.SaveChangesAsync();
            return Results.NoContent();
        }

        return Results.NotFound();
    }

    [HttpPost]
    public static async Task<IResult> CreateFavourite(CreateFavouriteRequest request, AppDbContext dbContext)
    {

        // Check if the favourite already exists 
        var exists = dbContext.Favourites.Where(fav => fav.User.Id == request.UserId && fav.Recipe.Id == request.RecipeId).FirstOrDefault();

        if (exists != null)
        {
            return Results.BadRequest($"Favourite already exists for UserId {request.UserId} and RecipeId {request.RecipeId}");
        }

        Console.WriteLine("CREATING FAV");
        var user = dbContext.Users.Where(u => u.Id == request.UserId).FirstOrDefault();
        Console.WriteLine($"User -> {user.Email}");

        var recipe = dbContext.Recipes.Where(r => r.Id == request.RecipeId).FirstOrDefault();

        Console.WriteLine($"Recipe -> {recipe.Description}");

        if (recipe != null && user != null)
        {
            dbContext.Favourites.Add(new Favourite { Recipe = recipe, User = user, DateFavourited = DateTime.UtcNow });
            await dbContext.SaveChangesAsync();
        }

        var created = await dbContext.Favourites.Where(r => r.User.Id == request.UserId && r.Recipe.Id == request.RecipeId).FirstOrDefaultAsync();

        if (created == null)
        {
            Results.NotFound();
        }

        return Results.Ok(created);
    }

    public static void RegisterFavouritesEndpoints(this WebApplication app)
    {
        var favourites = app.MapGroup("/favourites");

        favourites.MapGet("userId={userId}&recipeId={recipeId}", GetFavouriteByUserAndRecipe);
        favourites.MapGet("/", GetFavourites);
        favourites.MapGet("/{userId}", GetFavouritesForUser);
        favourites.MapPost("/", CreateFavourite);
        favourites.MapDelete("/{id}", DeleteFavourite);
    }
}