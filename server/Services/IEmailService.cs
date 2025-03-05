namespace server.Services;

public interface IEmailService
{
    Task SendChatInvitation(string recipientEmail, string chatLink, string firstName);
    Task SendChangePasswordLink(string recipientEmail, string firstName, string password);
}