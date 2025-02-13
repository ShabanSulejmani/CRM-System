namespace server.Models;

public class UserForm
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Company { get; set; } = string.Empty;  // Ny property
    public DateTime CreatedAt { get; set; }
    public string Role { get; set; } = string.Empty;
}