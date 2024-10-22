using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationPlayground.Migrations
{
    /// <inheritdoc />
    public partial class Favourites4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "FavouritedBy",
                table: "Recipes",
                type: "text[]",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FavouritedBy",
                table: "Recipes");
        }
    }
}
