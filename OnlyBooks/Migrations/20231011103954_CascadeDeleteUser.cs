using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlyBooks.Migrations
{
    public partial class CascadeDeleteUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users",
                table: "Orders");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users",
                table: "Orders",
                column: "UserID",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users",
                table: "Orders");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users",
                table: "Orders",
                column: "UserID",
                principalTable: "User",
                principalColumn: "Id");
        }
    }
}
