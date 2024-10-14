using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApplicationPlayground.Migrations
{
    /// <inheritdoc />
    public partial class UserIdInstead : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "Recipes");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Recipes",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Recipes");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Recipes",
                type: "text",
                nullable: true);
        }
    }
}
