using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReversiMvcApp.Migrations
{
    public partial class CreateRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Winnaar",
                table: "Spel",
                newName: "Gewonnen");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Gewonnen",
                table: "Spel",
                newName: "Winnaar");
        }
    }
}
