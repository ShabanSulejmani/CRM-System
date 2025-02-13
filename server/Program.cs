using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Services;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

// Service configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
   options.AddPolicy("AllowReactApp",
       builder =>
       {
           builder
               .WithOrigins(
                   "http://localhost:3001",
                   "https://localhost:3001"
               )
               .AllowAnyMethod()
               .AllowAnyHeader();
       });
});

builder.Services.AddDbContext<AppDbContext>(options =>
   options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

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

// Fordon Endpoints
app.MapGet("/api/fordon", async (AppDbContext db) =>
{
   var submissions = await db.FordonForms.ToListAsync();
   return Results.Ok(submissions);
});

app.MapGet("/api/fordon/{id}", async (int id, AppDbContext db) =>
{
   var submission = await db.FordonForms.FindAsync(id);
   return submission is null ? Results.NotFound() : Results.Ok(submission);
});

app.MapPost("/api/fordon", async (FordonForm submission, AppDbContext db, IEmailService emailService, IConfiguration config) =>
{
   submission.ChatToken = Guid.NewGuid().ToString();
   submission.SubmittedAt = DateTime.UtcNow;
   submission.IsChatActive = true;

   db.FordonForms.Add(submission);
   await db.SaveChangesAsync();

   var baseUrl = config["BaseUrl"] ?? "http://localhost:3001";
   var chatLink = $"{baseUrl}/chat/{submission.ChatToken}";

   try
   {
       await emailService.SendChatInvitation(
           submission.Email,
           chatLink,
           submission.FirstName
       );
   }
   catch (Exception ex)
   {
       return Results.Ok(new
       {
           message = "Form submitted successfully but email delivery failed",
           submission
       });
   }

   return Results.Ok(new
   {
       message = "Form submitted successfully",
       submission
   });
});

// Tele Endpoints
app.MapGet("/api/tele", async (AppDbContext db) =>
{
   var submissions = await db.TeleForms.ToListAsync();
   return Results.Ok(submissions);
});

app.MapGet("/api/tele/{id}", async (int id, AppDbContext db) =>
{
   var submission = await db.TeleForms.FindAsync(id);
   return submission is null ? Results.NotFound() : Results.Ok(submission);
});

app.MapPost("/api/tele", async (TeleForm submission, AppDbContext db, IEmailService emailService, IConfiguration config) =>
{
   submission.ChatToken = Guid.NewGuid().ToString();
   submission.SubmittedAt = DateTime.UtcNow;
   submission.IsChatActive = true;

   db.TeleForms.Add(submission);
   await db.SaveChangesAsync();

   var baseUrl = config["BaseUrl"] ?? "http://localhost:3001";
   var chatLink = $"{baseUrl}/chat/{submission.ChatToken}";

   try
   {
       await emailService.SendChatInvitation(
           submission.Email,
           chatLink,
           submission.FirstName
       );
   }
   catch (Exception ex)
   {
       return Results.Ok(new
       {
           message = "Form submitted successfully but email delivery failed",
           submission
       });
   }

   return Results.Ok(new
   {
       message = "Form submitted successfully",
       submission
   });
});

// Forsakring Endpoints
app.MapGet("/api/forsakring", async (AppDbContext db) =>
{
   var submissions = await db.ForsakringsForms.ToListAsync();
   return Results.Ok(submissions);
});

app.MapGet("/api/forsakring/{id}", async (int id, AppDbContext db) =>
{
   var submission = await db.ForsakringsForms.FindAsync(id);
   return submission is null ? Results.NotFound() : Results.Ok(submission);
});

app.MapPost("/api/forsakring", async (ForsakringsForm submission, AppDbContext db, IEmailService emailService, IConfiguration config) =>
{
   submission.ChatToken = Guid.NewGuid().ToString();
   submission.SubmittedAt = DateTime.UtcNow;
   submission.IsChatActive = true;

   db.ForsakringsForms.Add(submission);
   await db.SaveChangesAsync();

   var baseUrl = config["BaseUrl"] ?? "http://localhost:3001";
   var chatLink = $"{baseUrl}/chat/{submission.ChatToken}";

   try
   {
       await emailService.SendChatInvitation(
           submission.Email,
           chatLink,
           submission.FirstName
       );
   }
   catch (Exception ex)
   {
       return Results.Ok(new
       {
           message = "Form submitted successfully but email delivery failed",
           submission
       });
   }

   return Results.Ok(new
   {
       message = "Form submitted successfully",
       submission
   });
});

// Common endpoint för att kolla chat token
app.MapGet("/api/chat/{chatToken}", async (string chatToken, AppDbContext db) =>
{
   // Kolla i alla tabeller efter chatToken
   var fordonSubmission = await db.FordonForms
       .FirstOrDefaultAsync(s => s.ChatToken == chatToken);
   if (fordonSubmission != null) return Results.Ok(fordonSubmission);

   var teleSubmission = await db.TeleForms
       .FirstOrDefaultAsync(s => s.ChatToken == chatToken);
   if (teleSubmission != null) return Results.Ok(teleSubmission);

   var forsakringSubmission = await db.ForsakringsForms
       .FirstOrDefaultAsync(s => s.ChatToken == chatToken);
   if (forsakringSubmission != null) return Results.Ok(forsakringSubmission);

   return Results.NotFound();
});

app.Run();