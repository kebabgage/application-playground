using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

public static class UsersEndPoints

{
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

    private static async Task<IResult> CreateUser(User user, AppDbContext dbContext)
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
    }

    public static void RegisterUsersEndpoints(this WebApplication app)
    {

        var users = app.MapGroup("/users");

        users.MapGet("/", GetUsers);
        users.MapGet("/{id}", GetUser);
        users.MapPost("/", CreateUser);
    }
}