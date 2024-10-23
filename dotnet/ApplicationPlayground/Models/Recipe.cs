using System.ComponentModel.DataAnnotations;

public class Recipe
{
    [Key]
    public int Id { get; set; }

    public string Title { get; set; }

    public string Description { get; set; }

    public User User { get; set; }

    public string[]? MethodSteps { get; set; }
    public string[]? Ingredients { get; set; }

    public string ImageUrl { get; set; }

    public string[]? FavouritedBy { get; set; }

    public bool? IsArchived { get; set; }

}