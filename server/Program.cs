using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Services;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.WebHost.UseUrls("http://localhost:5000"); // Lägg till denna rad för att explicit sätta porten

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.MapPost("/api/formsubmissions", async (
    FormSubmission submission,
    IEmailService emailService,
    AppDbContext context) =>
{
    submission.ChatToken = Guid.NewGuid().ToString();
    submission.SubmittedAt = DateTime.UtcNow;
    submission.IsChatActive = true;

    context.FormSubmissions.Add(submission);
    await context.SaveChangesAsync();

    var chatLink = $"https://din-domain.se/chat/{submission.ChatToken}";
    await emailService.SendChatInvitation(submission.Email, chatLink, submission.FirstName);

    return Results.Ok(new { message = "Form submitted successfully", chatToken = submission.ChatToken });
});

app.MapGet("/api/formsubmissions/{token}", async (string token, AppDbContext context) =>
{
    var submission = await context.FormSubmissions.FirstOrDefaultAsync(s => s.ChatToken == token);
    return submission != null 
        ? Results.Ok(submission)
        : Results.NotFound();
});

app.MapPut("/api/formsubmissions/{token}", async (string token, FormSubmission updates, AppDbContext context) =>
{
    var submission = await context.FormSubmissions.FirstOrDefaultAsync(s => s.ChatToken == token);
    if (submission == null) return Results.NotFound();
    
    submission.IsChatActive = updates.IsChatActive;
    await context.SaveChangesAsync();
    
    return Results.Ok(submission);
});

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.Run();