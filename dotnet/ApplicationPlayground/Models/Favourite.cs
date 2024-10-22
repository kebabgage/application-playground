using System.ComponentModel.DataAnnotations;

public class Favourite
{
    [Key]
    public int Id { get; set; }

    public User User { get; set; }
    public Recipe Recipe { get; set; }

    public DateTime DateFavourited { get; set; }
}