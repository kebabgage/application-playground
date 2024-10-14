using Microsoft.Extensions.FileProviders;

namespace ApplicationPlayground.Controllers;

public static class ImagesController
{
    private static string GetStoragePath()
    {

        return Environment.GetEnvironmentVariable("DOCKER") switch
        {
            "true" => Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, @"../files")),
            _ => Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, @"..\..\filesystem\")),
        };

    }
    private static async Task<IResult> CreateImage(IFormFile file, string originalFileName)
    {



        if (file.Length > 0)
        {
            Console.WriteLine("Uploading file" + file.Name + "extension" + Path.GetExtension(file.FileName));
            var fileName = Path.ChangeExtension(Path.GetRandomFileName(), Path.GetExtension(originalFileName));
            var filePath = Path.Combine(GetStoragePath(), fileName);

            using var stream = File.Create(filePath);
            await file.CopyToAsync(stream);

            return Results.Created("/image", fileName);
        }

        return Results.NoContent();
    }
    public static void RegisterImageEndPoints(this WebApplication app)
    {
        var images = app.MapGroup("/images");

        images.MapPost("/", CreateImage).DisableAntiforgery();

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
            GetStoragePath()),
            RequestPath = "/images"
        });

    }
}