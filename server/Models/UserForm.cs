namespace server.Models;

public class UserForm
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Company { get; set; } = string.Empty;
    public short? Role_id { get; set; } // Foreign key to Role table (nullable if necessary)
}
