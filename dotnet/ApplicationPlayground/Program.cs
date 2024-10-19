using System.Diagnostics;
using ApplicationPlayground.Controllers;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using OpenAI.Chat;
using ApplicationPlayground.Util;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var Configuration = builder.Configuration;
var ConnectionString = Environment.GetEnvironmentVariable("DOCKER") switch
{
    "true" => "DefaultConnection",
    _ => "LocalhostConnection",
};

var StoragePath = Environment.GetEnvironmentVariable("DOCKER") switch
{
    "true" => Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, @"../files")),
    _ => Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, @"..\..\filesystem\")),
};



builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(Configuration.GetConnectionString(ConnectionString)));

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000", "http://localhost:8080", "http://35.224.146.250");
                          policy.AllowAnyHeader();
                          policy.AllowAnyMethod();
                      });
});


// Just setting the name of XSRF token
builder.Services.AddAntiforgery(options => options.HeaderName = "X-XSRF-TOKEN");

builder.Services.AddAuthentication();
builder.Services.AddAuthorization();



// Set up the API key to be accessed in the Controller classes
var apiKey = Environment.GetEnvironmentVariable("OPEN_AI_KEY") ?? Configuration.GetSection("OpenAIKey").GetValue<string>("Default");
if (apiKey != null)
{
    OpenAIConfig openAIConfig = new() { ApiKey = apiKey };
    builder.Services.AddSingleton(openAIConfig);
}

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// Get token endpoint
// app.MapGet("antiforgery/token", (IAntiforgery forgeryService, HttpContext context) =>
// {
//     var tokens = forgeryService.GetAndStoreTokens(context);
//     var xsrfToken = tokens.RequestToken!;
//     return TypedResults.Content(xsrfToken, "text/plain");
// });

app.UseCors(MyAllowSpecificOrigins);

app.UseAntiforgery();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetService<AppDbContext>();

    if (context != null)
    {
        var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
        if (pendingMigrations != null)
        {
            await context.Database.MigrateAsync();
        }
    }
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.RegisterUsersEndpoints();
app.RegisterRecipesEndpoints();
app.RegisterAiEndpoints();
app.RegisterImageEndPoints();


app.Run();
