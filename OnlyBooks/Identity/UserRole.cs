using Microsoft.AspNetCore.Identity;

namespace OnlyBooks.Identity
{
    public class UserRole : IdentityRole<int>
    {
        public UserRole() { }
        public UserRole(string roleName) : base(roleName) { }
    }
}