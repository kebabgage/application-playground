using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ApplicationPlayground.Controllers;
public static class UsersController
{

    public static void RegisterUsersEndpoints(this WebApplication app)
    {

        var users = app.MapGroup("/users");

        users.MapGet("/", GetUsers);
        users.MapGet("/{id}", GetUser);
        users.MapGet("/email={email}", GetUserByEmail);
        users.MapPost("/", CreateUser);
        users.MapDelete("/{id}", DeleteUser);
    }

    private static List<User> GetUsers(AppDbContext dbContext)
    {
        return dbContext.Users.OrderBy(r => r.Id).ToList();
    }

    private static async Task<IResult> GetUser(int id, AppDbContext dbContext)
    {
        var user = await dbContext.Users.FindAsync(id);


        if (user is null)
        {
            return Results.NotFound(id);

        };

        return Results.Ok(user);
    }

    private static IResult GetUserByEmail(string email, AppDbContext dbContext)
    {
        var user = dbContext.Users.Where(u => u.Email == email).FirstOrDefault();

        if (user is null)
        {
            return Results.NotFound(email);
        }

        return Results.Ok(user);
    }

    private static async Task<IResult> CreateUser(User user, AppDbContext dbContext)
    {
        // Check if we already have someone with this user 
        var userExists = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

        if (userExists == null)
        {
            Console.WriteLine($"User {user.Email} not found. Creating");

            user.LastLoggedIn = DateTime.UtcNow;
            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/users/{user.Id}", user);
        }
        else
        {
            Console.WriteLine($"User {user.Email} found. Updating");
            // Just incase they login and change their username
            userExists.UserName = user.UserName;
            userExists.LastLoggedIn = DateTime.UtcNow;
            userExists.ProfileImage = user.ProfileImage;
            await dbContext.SaveChangesAsync();
            return Results.Created($"/users/{user.Id}", userExists);
        }
    }

    private static async Task<IResult> DeleteUser(int id, AppDbContext dbContext)
    {
        if (await dbContext.Users.FindAsync(id) is User user)
        {
            dbContext.Users.Remove(user);
            await dbContext.SaveChangesAsync();
            return Results.NoContent();
        }

        return Results.NotFound();
    }
}