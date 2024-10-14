using Microsoft.EntityFrameworkCore;

namespace ApplicationPlayground.Controllers;

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
        dbContext.Recipes.Add(recipe);
        await dbContext.SaveChangesAsync();

        return Results.Created($"/recipes/{recipe.Id}", recipe);

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


    public static void RegisterRecipesEndpoints(this WebApplication app)
    {

        var recipes = app.MapGroup("/recipe");

        recipes.MapGet("/", GetRecipes);
        recipes.MapGet("/{id}", GetRecipe);
        recipes.MapPut("/{id}", UpdateRecipe);
        recipes.MapPost("/", CreateRecipe);
        recipes.MapDelete("/{id}", DeleteRecipe);
    }
}