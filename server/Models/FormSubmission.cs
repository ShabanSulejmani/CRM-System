
namespace server.Models;

public class FormSubmission
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string About { get; set; } = string.Empty;
    public string ChatToken { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public bool IsChatActive { get; set; }
} 
public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;  // Kom ihåg att detta bör vara hashat!
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public string Role { get; set; } = "user";  // t.ex: "admin", "user"
}