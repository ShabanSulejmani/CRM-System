using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Lägg till Authorization
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder
                .WithOrigins(
                    "http://localhost:3001",  // HTTP
                    "https://localhost:3001"   // HTTPS
                )
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Lägg till DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Lägg till Email Service
builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ordningen är viktig här
app.UseHttpsRedirection();
app.UseCors("AllowReactApp"); // CORS måste komma före Authorization

// Lägg till i denna ordning
app.UseAuthentication(); // Denna rad måste komma före UseAuthorization
app.UseAuthorization();

app.MapControllers();

app.Run();