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

    private static List<Recipe> GetRecipes(AppDbContext dbContext)
    {
        return dbContext.Recipes.Include(r => r.User).OrderBy(r => r.Id).ToList();
    }

    private static async Task<IResult> GetRecipe(int id, AppDbContext dbContext)
    {
        var recipe = await dbContext.Recipes.Include(r => r.User).FirstOrDefaultAsync(i => i.Id == id);

        if (recipe is null) return Results.NotFound(id);

        return Results.Ok(recipe);
    }

    private static async Task<IResult> UpdateRecipe(int id, Recipe inputRecipe, AppDbContext dbContext)
    {
        var recipe = await dbContext.Recipes.FindAsync(id);

        if (recipe is null) return Results.NotFound();

        recipe.Title = inputRecipe.Title;
        recipe.Description = inputRecipe.Description;
        recipe.ImageUrl = inputRecipe.ImageUrl;

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

    private static async Task<IResult> SearchRecipes(string value, AppDbContext dbContext)
    {
        var recipes = dbContext.Recipes.Where(r => r.Title.Contains(value) ||
            r.Description.Contains(value) ||
            r.Ingredients.Any(i => i.Contains(value)) ||
            r.MethodSteps.Any(i => i.Contains(value)) ||
            r.User.UserName.Contains(value)).Include(r => r.User);
        return Results.Ok(recipes);
    }

    private static async Task<IResult> SearchRecipes2(SearchParameters searchOption, AppDbContext dbContext)
    {

        IQueryable<Recipe> recipes = dbContext.Recipes;

        Console.WriteLine($"{searchOption?.UserEmails?.Length}");

        if (searchOption?.UserEmails != null && searchOption.UserEmails.Length != 0)
        {
            recipes = recipes.Include(r => r.User).Where(r => searchOption.UserEmails.Contains(r.User.Email));
            recipes.ToList().ForEach(r =>
            {
                Console.WriteLine($"{r.User.Email}");
            });
        }

        Console.WriteLine($"{recipes.ToArray().Length}");

        if (searchOption?.SearchValue != null && searchOption.SearchValue != "")
        {
            Console.WriteLine("Filtering by serach value");
            recipes = recipes.Where(r => r.Title.Contains(searchOption.SearchValue) ||
                      r.Description.Contains(searchOption.SearchValue) ||
                      r.Ingredients.Any(i => i.Contains(searchOption.SearchValue)) ||
                      r.MethodSteps.Any(i => i.Contains(searchOption.SearchValue)));
            Console.WriteLine($"{recipes.ToArray().Length}");
        }


        return Results.Ok(recipes);
    }


    public static void RegisterRecipesEndpoints(this WebApplication app)
    {

        var recipes = app.MapGroup("/recipe");

        recipes.MapGet("/", GetRecipes);
        recipes.MapGet("/{id}", GetRecipe);
        recipes.MapPut("/{id}", UpdateRecipe);
        recipes.MapPost("/", CreateRecipe);
        recipes.MapPost("/batch/", CreateRecipeBatch);
        recipes.MapDelete("/{id}", DeleteRecipe);
        // recipes.MapGet("/search/{value}", SearchRecipes);
        recipes.MapPost("/search/", SearchRecipes2);
    }
}