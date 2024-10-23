using System.Runtime.InteropServices;
using System.Xml.Schema;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApplicationPlayground.Controllers;

public class SearchParameters
{
    public string SearchValue { get; set; }
    public string[]? UserEmails { get; set; }
}

public static class RecipesController
{

    private static async Task<IResult> GetRecipes(AppDbContext dbContext)
    {
        var recipes = dbContext.Recipes.Include(r => r.User).OrderBy(r => r.Id).ToList();

        // foreach (var r in recipes)
        // {
        //     var favourites = await dbContext.Favourites.Where(f => f.Recipe.Id == r.Id).Include(f => f.User).ToListAsync();
        //     List<string> favouritedBy = [];
        //     foreach (var f in favourites)
        //     {
        //         favouritedBy.Add(f.User.UserName);
        //     }

        //     r.FavouritedBy = favouritedBy.ToArray();
        // }

        return Results.Ok(recipes);

    }

    private static async Task<IResult> GetRecipe(int id, AppDbContext dbContext)
    {
        var recipe = await dbContext.Recipes.Include(r => r.User).FirstOrDefaultAsync(i => i.Id == id);

        if (recipe is null) return Results.NotFound(id);

        // var favourites = await dbContext.Favourites.Where(f => f.Recipe.Id == recipe.Id).Include(f => f.User).ToListAsync();
        // var favouritesCount = dbContext.Favourites.Where(f => f.Recipe.Id == recipe.Id).Count();

        // Console.WriteLine($"Favouted {favouritesCount} times");

        // if (favourites != null)
        // {
        //     Console.WriteLine("Not null");
        //     foreach (var f in favourites)
        //     {
        //         Console.WriteLine(f.User.UserName);
        //     }

        //     List<string> favouritedBy = [];
        //     foreach (var f in favourites)
        //     {
        //         favouritedBy.Add(f.User.UserName);
        //     }

        //     recipe.FavouritedBy = favouritedBy.ToArray();


        // }

        // foreach (var f in favourites)
        // {
        //     Console.WriteLine($"faveed by {f.User.UserName}");
        // }


        return Results.Ok(recipe);
    }

    private static async Task<IResult> UpdateRecipe(int id, Recipe inputRecipe, AppDbContext dbContext)
    {
        var recipe = await dbContext.Recipes.FindAsync(id);

        if (recipe is null) return Results.NotFound();

        recipe.Title = inputRecipe.Title;
        recipe.Description = inputRecipe.Description;
        recipe.ImageUrl = inputRecipe.ImageUrl;

        recipe.IsArchived = inputRecipe.IsArchived;

        await dbContext.SaveChangesAsync();

        return Results.Created($"/recipes/{recipe.Id}", recipe);
    }

    private static async Task<IResult> CreateRecipe(Recipe recipe, AppDbContext dbContext)
    {
        if (recipe.User != null)
        {
            // Try and find the user 
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == recipe.User.Email);
            if (user == null)
            {
                // Add the user 
                await dbContext.Users.AddAsync(recipe.User);
            }
            else
            {
                recipe.User = user;
            }
        }

        dbContext.Recipes.Add(recipe);
        await dbContext.SaveChangesAsync();

        return Results.Created($"/recipes/{recipe.Id}", recipe);

    }

    private static async Task<IResult> CreateRecipeBatch(Recipe[] recipes, AppDbContext dbContext)
    {
        foreach (var recipe in recipes)
        {
            Console.WriteLine($"{recipe.Title}");
            await CreateRecipe(recipe, dbContext);
        }

        await dbContext.SaveChangesAsync();

        return Results.Created("$/recipes/batch/", recipes);
    }


    private static async Task<IResult> DeleteRecipe(int id, AppDbContext dbContext)
    {
        if (await dbContext.Recipes.FindAsync(id) is Recipe recipe)
        {
            dbContext.Recipes.Remove(recipe);
            await dbContext.SaveChangesAsync();
            return Results.NoContent();
        }

        return Results.NotFound();
    }


    private static async Task<IResult> SearchRecipes(SearchParameters searchOption, AppDbContext dbContext)
    {

        IQueryable<Recipe> recipes = dbContext.Recipes;


        if (searchOption?.UserEmails != null && searchOption.UserEmails.Length != 0)
        {
            recipes = recipes.Include(r => r.User).Where(r => searchOption.UserEmails.Contains(r.User.Email));

        }


        if (searchOption?.SearchValue != null && searchOption.SearchValue != "")
        {
            recipes = recipes.Where(r => r.Title.Contains(searchOption.SearchValue) ||
                      r.Description.Contains(searchOption.SearchValue) ||
                      r.Ingredients.Any(i => i.Contains(searchOption.SearchValue)) ||
                      r.MethodSteps.Any(i => i.Contains(searchOption.SearchValue)));
        }

        return Results.Ok(recipes);
    }

    private static async Task<IResult> GetArchivedRecipes(AppDbContext dbContext)
    {
        var recipes = dbContext.Recipes.Where(r => r.IsArchived == true).Include(r => r.User).OrderBy(r => r.Id).ToList();
        return Results.Ok(recipes);
    }


    public static void RegisterRecipesEndpoints(this WebApplication app)
    {

        var recipes = app.MapGroup("/recipes");

        recipes.MapGet("/", GetRecipes);
        recipes.MapGet("/{id}", GetRecipe);
        recipes.MapPut("/{id}", UpdateRecipe);
        recipes.MapPost("/", CreateRecipe);
        recipes.MapPost("/batch/", CreateRecipeBatch);
        recipes.MapDelete("/{id}", DeleteRecipe);
        recipes.MapPost("/search/", SearchRecipes);

        var archive = recipes.MapGroup("/archive");
        archive.MapGet("/", GetArchivedRecipes);
    }
}