namespace server.Services;

public interface IEmailService
{
    Task<bool> SendChatInvitation(string recipientEmail, string chatLink, string firstName);
}