using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Recipe> Recipes { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<Favourite> Favourites { get; set; }
}