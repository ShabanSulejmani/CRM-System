namespace server.Models;

public class ForsakringsForm
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public ForsakrningsTyp ForsakringsModel { get; set; }
    public ArendeTyp ArendeModel { get; set; }
    public string About { get; set; } = string.Empty;
    public string ChatToken { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public bool IsChatActive { get; set; }
}
public enum ForsakrningsTyp
{
   Hemförsäkring,
    Bilförsäkring,
    Livförsäkring,
    Olägenhetsförsäkring,
}

public enum ArendeTyp
{
   Pågenede,
    Försäkringskydd,
    Faktura,
    Ändra,
    Försäkringshandlingar
   
}