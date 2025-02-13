namespace server.Models;

public class FordonForm
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string RegistrationNumber { get; set; } = string.Empty;
    public string IssueType  { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string ChatToken { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public bool IsChatActive { get; set; }
}
