using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OnlyBooks.Models;
using System;
using System.Data;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OnlyBooks.Identity
{
    public class UserStore : IUserRoleStore<User>, IUserStore<User>, IQueryableUserStore<User>
    {
        private readonly OnlyBooksContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<User> _userManager;

        public UserStore(OnlyBooksContext context, RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        // Реализация методов интерфейса IUserRoleStore<User>

        public async Task AddToRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role != null)
            {
                var result = await _userManager.AddToRoleAsync(user, roleName);
                if (result.Succeeded)
                {
                    await _context.SaveChangesAsync(cancellationToken);
                }
            }
        }

        public async Task RemoveFromRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role != null)
            {
                var result = await _userManager.RemoveFromRoleAsync(user, roleName);
                if (result.Succeeded)
                {
                    await _context.SaveChangesAsync(cancellationToken);
                }
            }
        }

        public async Task<IList<string>> GetRolesAsync(User user, CancellationToken cancellationToken)
        {
            // Реализация получения ролей пользователя
            var roles = new List<string>();
            if (!string.IsNullOrWhiteSpace(user.Role))
            {
                roles.Add(user.Role);
            }
            return roles;
        }

        public async Task<bool> IsInRoleAsync(User user, string roleName, CancellationToken cancellationToken)
        {
            // Реализация проверки, находится ли пользователь в роли
            return string.Equals(user.Role, roleName, StringComparison.OrdinalIgnoreCase);
        }

        // Реализация методов интерфейса IUserStore<User>

        public async Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
        {
            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            return result;
        }

        public async Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            // Реализация обновления данных пользователя
            _context.Set<User>().Update(user);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
        {
            // Реализация удаления пользователя
            _context.Set<User>().Remove(user);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            // Реализация поиска пользователя по Id
            // Преобразуем строку userId в int
            if (int.TryParse(userId, out int userIdAsInt))
            {
                return await _context.Set<User>().SingleOrDefaultAsync(u => u.Id == userIdAsInt, cancellationToken);
            }

            return null;
        }

        public async Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            // Реализация поиска пользователя по имени (normalizedUserName)
            return await _context.Set<User>().SingleOrDefaultAsync(u => u.NormalizedUserName == normalizedUserName, cancellationToken);
        }

        // Реализация методов интерфейса IQueryableUserStore<User>

        public IQueryable<User> Users => _context.Set<User>().AsQueryable();

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
        {
            string userIdAsString = user.Id.ToString();
            return Task.FromResult(userIdAsString);
        }
        public async Task<string> GetNormalizedRoleNameAsync(UserRole role, CancellationToken cancellationToken)
        {
            return role.NormalizedName;
        }

        public async Task SetNormalizedRoleNameAsync(UserRole role, string normalizedName, CancellationToken cancellationToken)
        {
            role.NormalizedName = normalizedName;
        }

        public Task<string> GetUserNameAsync(User user, CancellationToken cancellationToken)
        {
            // Реализация получения имени пользователя
            return Task.FromResult(user.UserName);
        }

        public Task SetUserNameAsync(User user, string userName, CancellationToken cancellationToken)
        {
            // Реализация установки имени пользователя
            user.UserName = userName;
            return Task.CompletedTask;
        }

        public Task<string> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
        {
            // Реализация получения нормализованного имени пользователя
            return Task.FromResult(user.NormalizedUserName);
        }

        public Task SetNormalizedUserNameAsync(User user, string normalizedName, CancellationToken cancellationToken)
        {
            // Реализация установки нормализованного имени пользователя
            user.NormalizedUserName = normalizedName;
            return Task.CompletedTask;
        }

        public async void Dispose()
        {
            // Реализация очистки ресурсов, если необходимо
            await _context.DisposeAsync();
        }

        public Task<IList<User>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
