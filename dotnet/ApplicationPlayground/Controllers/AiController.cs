using ApplicationPlayground.Util;
using OpenAI.Chat;

namespace ApplicationPlayground.Controllers;

public static class AiController
{
    private static IResult GetAIEnabled(OpenAIConfig config)
    {
        if (config.ApiKey != null && config.ApiKey != "")
        {
            return Results.Ok(true);
        }
        else
        {
            return Results.Ok(false);
        }
    }
    private static async Task<IResult> GetDescription(string title, OpenAIConfig config)
    {
        Console.WriteLine("I'm inside the AI generate function");
        Console.WriteLine($"The api key is {config.ApiKey}");

        ChatClient client = new(model: "gpt-4o", apiKey: config.ApiKey);

        Console.Write("I'm after the client created");

        ChatCompletion completion = await client.CompleteChatAsync($"Give me a short description for my recipe called {title}. Only return me the description");


        return Results.Ok(completion.Content[0].Text);
    }

    public static void RegisterAiEndpoints(this WebApplication app)
    {
        var ai = app.MapGroup("/ai");

        ai.MapGet("/description", GetDescription);
        ai.MapGet("/", GetAIEnabled);
    }
}