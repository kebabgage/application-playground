using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int Id { get; set; }

    public string UserName { get; set; }

    public string Email { get; set; }
    public DateTime LastLoggedIn { get; set; }
}