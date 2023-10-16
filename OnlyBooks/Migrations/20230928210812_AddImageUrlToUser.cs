using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlyBooks.Migrations
{
    public partial class AddImageUrlToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "User",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "User");
        }
    }
}
