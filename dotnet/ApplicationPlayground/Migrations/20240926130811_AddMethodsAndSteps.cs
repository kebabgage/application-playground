using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationPlayground.Migrations
{
    /// <inheritdoc />
    public partial class AddMethodsAndSteps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "Ingredients",
                table: "Recipes",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<string[]>(
                name: "MethodSteps",
                table: "Recipes",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ingredients",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "MethodSteps",
                table: "Recipes");
        }
    }
}
