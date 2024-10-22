using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int Id { get; set; }

    public string? UserName { get; set; }

    public string? Email { get; set; }
    public DateTime LastLoggedIn { get; set; }

    public string? ProfileImage { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }
}