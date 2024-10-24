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
        users.MapPut("/", UpdateUser);
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
            if (user.UserName != null)
            {
                userExists.UserName = user.UserName;
            }

            if (user.ProfileImage != null)
            {
                userExists.ProfileImage = user.ProfileImage;
            }

            userExists.LastLoggedIn = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
            return Results.Created($"/users/{user.Id}", userExists);
        }
    }

    private static async Task<IResult> UpdateUser(User user, AppDbContext dbContext)
    {
        // Check if we already have someone with this user 
        var userExists = await dbContext.Users.FindAsync(user.Id);

        if (userExists == null)
        {
            return Results.NotFound();
        }

        if (user.Email != null && user.Email != "")
        {
            userExists.Email = user.Email;
        }

        if (user.FirstName != null && user.FirstName != "")
        {
            userExists.FirstName = user.FirstName;
        }

        if (user.LastName != null && user.LastName != "")
        {
            userExists.LastName = user.LastName;
        }

        if (user.UserName != null && user.UserName != "")
        {
            userExists.UserName = user.UserName;
        }

        await dbContext.SaveChangesAsync();

        // Fetch the user 
        var fetchedUser = await dbContext.Users.FindAsync(user.Id);

        return Results.Ok(fetchedUser);
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