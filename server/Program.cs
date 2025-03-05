using server.Services;
using server.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using Npgsql;
using Microsoft.AspNetCore.Http.Json;

namespace server;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        
        // Använd connection string från appsettings.json istället
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        
        // Skapa datasource med förbättrade timeout-inställningar
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.ConnectionStringBuilder.CommandTimeout = 90; // Öka timeout till 90 sekunder        
        NpgsqlDataSource postgresdb = dataSourceBuilder.Build();
        
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddAuthentication();
        builder.Services.AddAuthorization();
        builder.Services.AddSingleton<NpgsqlDataSource>(postgresdb);
        
        // Förbättrade CORS-inställningar
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowReactApp", policy =>
            {
                policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "https://din-domain.se")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        // Förbättrade JSON-inställningar
        builder.Services.Configure<JsonOptions>(options =>
        {
            options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        });

        builder.Services.AddScoped<IEmailService, EmailService>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors("AllowReactApp");
        app.UseAuthentication();
        app.UseAuthorization();

        // Lägg till middleware för debugging (kan tas bort i produktion)
        app.Use(async (context, next) =>
        {
            // Spara originalposition för request body
            var originalBodyStream = context.Request.Body;
            
            try
            {
                // Läs begäran om det är en POST till en av våra form-endpoints
                string path = context.Request.Path.ToString().ToLower();
                if (context.Request.Method == "POST" && 
                    (path.Contains("/api/tele") || path.Contains("/api/fordon") || path.Contains("/api/forsakring")))
                {
                    // Endast debugga för specifika endpoints
                    using var bodyReader = new StreamReader(context.Request.Body);
                    var bodyAsText = await bodyReader.ReadToEndAsync();
                    
                    // Logga raw body
                    Console.WriteLine($"Request for {context.Request.Path}: {bodyAsText}");
                    
                    // Återställ body
                    var bodyMemoryStream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(bodyAsText));
                    bodyMemoryStream.Position = 0;
                    context.Request.Body = bodyMemoryStream;
                }

                await next.Invoke();
            }
            finally
            {
                // Återställ den ursprungliga stream
                context.Request.Body = originalBodyStream;
            }
        });
        
        
        app.MapPost("/api/chat/message", async (ChatMessage message, NpgsqlDataSource db) =>
        {
            try
            {
                using var cmd = db.CreateCommand(@"
            INSERT INTO chat_messages (chat_token, sender, message, submitted_at)
            VALUES (@chat_token, @sender, @message, @submitted_at)
            RETURNING id, sender, message, submitted_at, chat_token");
 
                cmd.Parameters.AddWithValue("chat_token", message.ChatToken);
                cmd.Parameters.AddWithValue("sender", message.Sender);
                cmd.Parameters.AddWithValue("message", message.Message);
                cmd.Parameters.AddWithValue("submitted_at", DateTime.UtcNow);
 
                using var reader = await cmd.ExecuteReaderAsync();
        
                if (await reader.ReadAsync())
                {
                    var createdMessage = new {
                        id = reader.GetInt32(0),
                        sender = reader.GetString(1),
                        message = reader.GetString(2),
                        timestamp = reader.GetDateTime(3),
                        chatToken = reader.GetString(4)
                    };
            
                    return Results.Ok(createdMessage);
                }
        
                return Results.BadRequest(new { message = "Message could not be created" });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = "Could not send message", error = ex.Message });
            }
        });
        
        app.MapGet("/api/chat/messages/{chatToken}", async (string chatToken, NpgsqlDataSource db) =>
        {
            try
            {
                List<object> messages = new();
        
                using var cmd = db.CreateCommand(@"
            SELECT id, sender, message, submitted_at, chat_token
            FROM chat_messages 
            WHERE chat_token = @chat_token
            ORDER BY submitted_at ASC");
        
                cmd.Parameters.AddWithValue("chat_token", chatToken);
        
                using var reader = await cmd.ExecuteReaderAsync();
        
                while (await reader.ReadAsync())
                {
                    messages.Add(new
                    {
                        id = reader.GetInt32(0),
                        sender = reader.GetString(1),
                        message = reader.GetString(2),
                        timestamp = reader.GetDateTime(3),
                        chatToken = reader.GetString(4)
                    });
                }
        
                // Also get the chat "owner" (first unique sender)
                string chatOwner = null;
                if (messages.Count > 0)
                {
                    // Assuming the first message's sender is the chat owner
                    chatOwner = ((dynamic)messages[0]).sender;
                }
        
                return Results.Ok(new { 
                    messages, 
                    chatOwner 
                });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = "Could not fetch messages", error = ex.Message });
            }
        });
        
        
        
        

        // User Endpoints
        app.MapPost("/api/users", async (UserForm user, NpgsqlDataSource db) =>
        {
            try
            {
                user.CreatedAt = DateTime.UtcNow;
                using var cmd = db.CreateCommand(@"
                    INSERT INTO users (first_name, password, company, created_at, role_id)
                    VALUES (@first_name, @password, @company, @created_at, @role_id)
                    RETURNING id, first_name, company, created_at;");

                cmd.Parameters.AddWithValue("first_name", user.FirstName);
                cmd.Parameters.AddWithValue("password", user.Password);
                cmd.Parameters.AddWithValue("company", user.Company);
                cmd.Parameters.AddWithValue("created_at", user.CreatedAt);
                cmd.Parameters.AddWithValue("role_id", 1);

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return Results.Ok(new
                    {
                        message = "Användare skapad",
                        user = new
                        {
                            Id = reader.GetInt32(0),
                            FirstName = reader.GetString(1),
                            Company = reader.GetString(2),
                            CreatedAt = reader.GetDateTime(3)
                        }
                    });
                }

                return Results.BadRequest(new { message = "Kunde inte skapa användare" });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new
                {
                    message = "Kunde inte skapa användare",
                    error = ex.Message
                });
            }
        });

        app.MapGet("/api/users", async (NpgsqlDataSource db) =>
        {
            List<UserForm> users = new();
            
            using var cmd = db.CreateCommand("SELECT users.\"Id\" as \"id\", users.first_name, users.company, users.role_id FROM users\n");
            var reader = await cmd.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                users.Add(new UserForm
                {
                    Id = reader.GetInt32(0),
                    FirstName = reader.GetString(1),
                    Company = reader.GetString(2),
                    Role = reader.GetInt32(3) == 1 ? "staff" : "admin"
                });
            }
            
            return Results.Ok(users);
        });
        

        // Fordon Form Endpoints
app.MapPost("/api/fordon", async (FordonForm submission, NpgsqlDataSource db, IEmailService emailService, IConfiguration config, ILogger<Program> logger) =>
{
    // Skapa en anslutning som vi kan använda för transaktioner
    using var connection = await db.OpenConnectionAsync();
    using var transaction = await connection.BeginTransactionAsync();
    
    try
    {
        submission.ChatToken = Guid.NewGuid().ToString();
        submission.SubmittedAt = DateTime.UtcNow;
        submission.IsChatActive = true;

        using var cmd = new NpgsqlCommand(@"
            INSERT INTO fordon_forms (first_name, email, reg_nummer, issue_type, message, chat_token, submitted_at, is_chat_active, company_type)
            VALUES (@first_name, @email, @reg_nummer, @issue_type, @message, @chat_token, @submitted_at, @is_chat_active, @company_type)", connection, transaction);

        cmd.Parameters.AddWithValue("first_name", submission.FirstName);
        cmd.Parameters.AddWithValue("email", submission.Email);
        cmd.Parameters.AddWithValue("reg_nummer", submission.RegNummer);
        cmd.Parameters.AddWithValue("issue_type", submission.IssueType);
        cmd.Parameters.AddWithValue("message", submission.Message);
        cmd.Parameters.AddWithValue("chat_token", submission.ChatToken);
        cmd.Parameters.AddWithValue("submitted_at", submission.SubmittedAt);
        cmd.Parameters.AddWithValue("is_chat_active", submission.IsChatActive);
        cmd.Parameters.AddWithValue("company_type", submission.CompanyType);

        await cmd.ExecuteNonQueryAsync();

        using var chatCmd = new NpgsqlCommand(@"
            INSERT INTO chat_messages ( sender, message, submitted_at, chat_token)
            VALUES ( @sender, @message, @submitted_at, @chat_token)", connection, transaction);

       
        chatCmd.Parameters.AddWithValue("sender", submission.FirstName);
        chatCmd.Parameters.AddWithValue("message", submission.Message);
        chatCmd.Parameters.AddWithValue("submitted_at", submission.SubmittedAt);
        chatCmd.Parameters.AddWithValue("chat_token", submission.ChatToken);

        await chatCmd.ExecuteNonQueryAsync();
        
        // Slutför transaktionen
        await transaction.CommitAsync();

        // Skapa chattlänk efter lyckad databastransaktion
        var baseUrl = config["AppSettings:BaseUrl"] ?? "http://localhost:3001";
        var chatLink = $"{baseUrl}/chat/{submission.ChatToken}";

        bool emailSent = await emailService.SendChatInvitation(
            submission.Email,
            chatLink,
            submission.FirstName
        );

        logger.LogInformation(
            "Fordon form submitted successfully. Email sent: {EmailSent}. ChatToken: {ChatToken}", 
            emailSent, 
            submission.ChatToken
        );

        return Results.Ok(new {
            success = true,
            message = emailSent
                ? "Formulär skickat! Kolla din e-post för chattlänken."
                : "Formulär skickat! Men e-post med chattlänken kunde inte skickas, du kan fortfarande nå chatten via denna länk.",
            submission,
            chatLink
        });
    }
    catch (Exception ex)
    {
        // Rulla tillbaka transaktionen om något går fel
        await transaction.RollbackAsync();
        
        logger.LogError(ex, "Fel när ett Fordonformulär skulle sparas: {Message}", ex.Message);
        return Results.BadRequest(new { 
            success = false,
            message = "Ett fel uppstod när formuläret skulle sparas. Försök igen senare.", 
            error = ex.Message 
        });
    }
});

// Tele Form Endpoints
app.MapPost("/api/tele", async (TeleForm submission, NpgsqlDataSource db, IEmailService emailService, IConfiguration config, ILogger<Program> logger) =>
{
    // Skapa en anslutning som vi kan använda för transaktioner
    using var connection = await db.OpenConnectionAsync();
    using var transaction = await connection.BeginTransactionAsync();
    
    try
    {
        submission.ChatToken = Guid.NewGuid().ToString();
        submission.SubmittedAt = DateTime.UtcNow;
        submission.IsChatActive = true;

        using var cmd = new NpgsqlCommand(@"
            INSERT INTO tele_forms (first_name, email, service_type, issue_type, message, chat_token, submitted_at, is_chat_active, company_type)
            VALUES (@first_name, @email, @service_type, @issue_type, @message, @chat_token, @submitted_at, @is_chat_active, @company_type)", connection, transaction);

        cmd.Parameters.AddWithValue("first_name", submission.FirstName);
        cmd.Parameters.AddWithValue("email", submission.Email);
        cmd.Parameters.AddWithValue("service_type", submission.ServiceType);
        cmd.Parameters.AddWithValue("issue_type", submission.IssueType);
        cmd.Parameters.AddWithValue("message", submission.Message);
        cmd.Parameters.AddWithValue("chat_token", submission.ChatToken);
        cmd.Parameters.AddWithValue("submitted_at", submission.SubmittedAt);
        cmd.Parameters.AddWithValue("is_chat_active", submission.IsChatActive);
        cmd.Parameters.AddWithValue("company_type", submission.CompanyType);

        await cmd.ExecuteNonQueryAsync();

        using var chatCmd = new NpgsqlCommand(@"
            INSERT INTO chat_messages ( sender, message, submitted_at, chat_token)
            VALUES ( @sender, @message, @submitted_at, @chat_token)", connection, transaction);

       
        chatCmd.Parameters.AddWithValue("sender", submission.FirstName);
        chatCmd.Parameters.AddWithValue("message", submission.Message);
        chatCmd.Parameters.AddWithValue("submitted_at", submission.SubmittedAt);
         chatCmd.Parameters.AddWithValue("chat_token", submission.ChatToken);
        await chatCmd.ExecuteNonQueryAsync();
        
        // Slutför transaktionen
        await transaction.CommitAsync();

        // Skapa chattlänk efter lyckad databastransaktion
        var baseUrl = config["AppSettings:BaseUrl"] ?? "http://localhost:3001";
        var chatLink = $"{baseUrl}/chat/{submission.ChatToken}";

        bool emailSent = await emailService.SendChatInvitation(
            submission.Email,
            chatLink,
            submission.FirstName
        );

        logger.LogInformation(
            "Tele form submitted successfully. Email sent: {EmailSent}. ChatToken: {ChatToken}", 
            emailSent, 
            submission.ChatToken
        );

        return Results.Ok(new {
            success = true,
            message = emailSent
                ? "Formulär skickat! Kolla din e-post för chattlänken."
                : "Formulär skickat! Men e-post med chattlänken kunde inte skickas, du kan fortfarande nå chatten via denna länk.",
            submission,
            chatLink
        });
    }
    catch (Exception ex)
    {
        // Rulla tillbaka transaktionen om något går fel
        await transaction.RollbackAsync();
        
        logger.LogError(ex, "Fel när ett Teleformulär skulle sparas: {Message}", ex.Message);
        return Results.BadRequest(new { 
            success = false,
            message = "Ett fel uppstod när formuläret skulle sparas. Försök igen senare.", 
            error = ex.Message 
        });
    }
});

// Forsakring Form Endpoints
app.MapPost("/api/forsakring", async (ForsakringsForm submission, NpgsqlDataSource db, IEmailService emailService, IConfiguration config, ILogger<Program> logger) =>
{
    // Skapa en anslutning som vi kan använda för transaktioner
    using var connection = await db.OpenConnectionAsync();
    using var transaction = await connection.BeginTransactionAsync();
    
    try
    {
        submission.ChatToken = Guid.NewGuid().ToString();
        submission.SubmittedAt = DateTime.UtcNow;
        submission.IsChatActive = true;

        using var cmd = new NpgsqlCommand(@"
            INSERT INTO forsakrings_forms (first_name, email, insurance_type, issue_type, message, chat_token, submitted_at, is_chat_active, company_type)
            VALUES (@first_name, @email, @insurance_type, @issue_type, @message, @chat_token, @submitted_at, @is_chat_active, @company_type)", connection, transaction);

        cmd.Parameters.AddWithValue("first_name", submission.FirstName);
        cmd.Parameters.AddWithValue("email", submission.Email);
        cmd.Parameters.AddWithValue("insurance_type", submission.InsuranceType);
        cmd.Parameters.AddWithValue("issue_type", submission.IssueType);
        cmd.Parameters.AddWithValue("message", submission.Message);
        cmd.Parameters.AddWithValue("chat_token", submission.ChatToken);
        cmd.Parameters.AddWithValue("submitted_at", submission.SubmittedAt);
        cmd.Parameters.AddWithValue("is_chat_active", submission.IsChatActive);
        cmd.Parameters.AddWithValue("company_type", submission.CompanyType);

        await cmd.ExecuteNonQueryAsync();

        using var chatCmd = new NpgsqlCommand(@"
            INSERT INTO chat_messages ( sender, message, submitted_at, chat_token)
            VALUES ( @sender, @message, @submitted_at, @chat_token)", connection, transaction);

       
        chatCmd.Parameters.AddWithValue("sender", submission.FirstName);
        chatCmd.Parameters.AddWithValue("message", submission.Message);
        chatCmd.Parameters.AddWithValue("submitted_at", submission.SubmittedAt);
        chatCmd.Parameters.AddWithValue("chat_token", submission.ChatToken);

        await chatCmd.ExecuteNonQueryAsync();
        
        // Slutför transaktionen
        await transaction.CommitAsync();

        // Skapa chattlänk efter lyckad databastransaktion
        var baseUrl = config["AppSettings:BaseUrl"] ?? "http://localhost:3001";
        var chatLink = $"{baseUrl}/chat/{submission.ChatToken}";

        bool emailSent = await emailService.SendChatInvitation(
            submission.Email,
            chatLink,
            submission.FirstName
        );

        logger.LogInformation(
            "Försäkrings form submitted successfully. Email sent: {EmailSent}. ChatToken: {ChatToken}", 
            emailSent, 
            submission.ChatToken
        );

        return Results.Ok(new {
            success = true,
            message = emailSent
                ? "Formulär skickat! Kolla din e-post för chattlänken."
                : "Formulär skickat! Men e-post med chattlänken kunde inte skickas, du kan fortfarande nå chatten via denna länk.",
            submission,
            chatLink
        });
    }
    catch (Exception ex)
    {
        // Rulla tillbaka transaktionen om något går fel
        await transaction.RollbackAsync();
        
        logger.LogError(ex, "Fel när ett Försäkringsformulär skulle sparas: {Message}", ex.Message);
        return Results.BadRequest(new { 
            success = false,
            message = "Ett fel uppstod när formuläret skulle sparas. Försök igen senare.", 
            error = ex.Message 
        });
    }
});

        // Initial Message Endpoints
        app.MapPost("/api/initial-message", async (InitialMessage message, NpgsqlDataSource db) =>
        {
            try
            {
                using var cmd = db.CreateCommand(@"
                    INSERT INTO initial_form_messages (chat_token, sender, message, submitted_at, issue_type, email, form_type)
                    VALUES (@chat_token, @sender, @message, @submitted_at, @issue_type, @email, @form_type)");

                cmd.Parameters.AddWithValue("chat_token", message.ChatToken);
                cmd.Parameters.AddWithValue("sender", message.Sender);
                cmd.Parameters.AddWithValue("message", message.Message);
                cmd.Parameters.AddWithValue("submitted_at", DateTime.UtcNow);
                cmd.Parameters.AddWithValue("issue_type", message.IssueType);
                cmd.Parameters.AddWithValue("email", message.Email);
                cmd.Parameters.AddWithValue("form_type", message.FormType);

                await cmd.ExecuteNonQueryAsync();

                return Results.Ok(new { message = "Initial message created" });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = "Could not create initial message", error = ex.Message });
            }
        });

         // Hämta första meddelandet från formulär via chatToken
        app.MapGet("/api/initial-message/{chatToken}", async (string chatToken, NpgsqlDataSource db) =>
        {
            try
            {
                using var cmd = db.CreateCommand(@"
                    SELECT chat_token, sender, message, submitted_at, issue_type, email, form_type 
                    FROM initial_form_messages 
                    WHERE chat_token = @chat_token");

                cmd.Parameters.AddWithValue("chat_token", chatToken);

                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    var initialMessage = new
                    {
                        chatToken = reader.GetString(0),
                        sender = reader.GetString(1),
                        message = reader.GetString(2),
                        submittedAt = reader.GetDateTime(3),
                        issueType = reader.GetString(5),
                        formType = reader.GetString(6)
                    };

                    return Results.Ok(initialMessage);
                }

                return Results.NotFound("No initial message found with this chat token");
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = "Could not fetch initial message", error = ex.Message });
            }
        });
              
        // Tickets endpoint
       app.MapGet("/api/tickets", async (NpgsqlDataSource db) =>
{
    try
    {
        Console.WriteLine("Hämtar ärenden...");
        
        // Mycket enklare approach: skapa en anonym lista och fyll direkt
        var tickets = new List<Dictionary<string, object>>();
        
        using var cmd = db.CreateCommand(@"
            SELECT chat_token, message, sender, submitted_at, issue_type, email, form_type
            FROM initial_form_messages 
            ORDER BY submitted_at DESC");
        
        using var reader = await cmd.ExecuteReaderAsync();
        
        while (await reader.ReadAsync())
        {
            var ticket = new Dictionary<string, object>();
            
            // Hämta värden med nullhantering
            string chatToken = reader.IsDBNull(0) ? string.Empty : reader.GetString(0);
            
            ticket["chatToken"] = chatToken;
            ticket["id"] = chatToken; // Samma som chatToken
            ticket["message"] = reader.IsDBNull(1) ? string.Empty : reader.GetString(1);
            ticket["sender"] = reader.IsDBNull(2) ? string.Empty : reader.GetString(2);
            
            // Omvandla DateTime till string för att undvika JSON-serialiseringsproblem
            DateTime timestamp = reader.IsDBNull(3) ? DateTime.UtcNow : reader.GetDateTime(3);
            ticket["timestamp"] = timestamp.ToString("yyyy-MM-dd HH:mm:ss");
            
            ticket["issueType"] = reader.IsDBNull(4) ? string.Empty : reader.GetString(4);
            ticket["email"] = reader.IsDBNull(5) ? string.Empty : reader.GetString(5);
            ticket["formType"] = reader.IsDBNull(6) ? string.Empty : reader.GetString(6);
            
            // Extra fält som frontend förväntar sig
            ticket["wtp"] = ticket["formType"];
            ticket["chatLink"] = $"http://localhost:3001/chat/{chatToken}";
            
            tickets.Add(ticket);
        }
        
        Console.WriteLine($"Hittade {tickets.Count} ärenden");
        return Results.Ok(tickets);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Fel vid hämtning av ärenden: {ex.Message}");
        return Results.Text("ERROR"); // Returnera text istället för JSON vid fel
    }
});
       
       
       
        app.Run(); // Startar webbservern
    }

    public record GetTicketsDTO(
        string ChatToken,
        string Id,
        string Message,
        string Sender,
        DateTime Timestamp,
        string IssueType,
        string Email,
        string FormType);
}