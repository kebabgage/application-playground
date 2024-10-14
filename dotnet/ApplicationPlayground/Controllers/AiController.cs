using ApplicationPlayground.Util;
using OpenAI.Chat;

namespace ApplicationPlayground.Controllers;

public static class AiController
{
    private static async Task<IResult> GetDescription(string title, OpenAIConfig config)
    {
        ChatClient client = new(model: "gpt-4o", apiKey: config.ApiKey);

        ChatCompletion completion = await client.CompleteChatAsync($"Give me a short description for my recipe called {title}. Only return me the description");

        return Results.Ok(completion.Content[0].Text);
    }

    public static void RegisterAiEndpoints(this WebApplication app)
    {
        var ai = app.MapGroup("/ai");

        ai.MapGet("/description", GetDescription);
    }
}