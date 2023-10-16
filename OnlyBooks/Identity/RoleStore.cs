using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OnlyBooks.Models;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OnlyBooks.Identity
{
    public class RoleStore : IRoleStore<UserRole>, IQueryableRoleStore<UserRole>
    {
        private readonly OnlyBooksContext _context;

        public RoleStore(OnlyBooksContext context)
        {
            _context = context;
        }

        // Реализация методов интерфейса IRoleStore<UserRole>

        public async Task<IdentityResult> CreateAsync(UserRole role, CancellationToken cancellationToken)
        {
            _context.Set<UserRole>().Add(role);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> UpdateAsync(UserRole role, CancellationToken cancellationToken)
        {
            _context.Set<UserRole>().Update(role);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(UserRole role, CancellationToken cancellationToken)
        {
            _context.Set<UserRole>().Remove(role);
            await _context.SaveChangesAsync(cancellationToken);
            return IdentityResult.Success;
        }

        public async Task<string> GetRoleIdAsync(UserRole role, CancellationToken cancellationToken)
        {
            // Получение Id роли в виде строки
            return role.Id.ToString();
        }

        public async Task<string> GetRoleNameAsync(UserRole role, CancellationToken cancellationToken)
        {
            return role.Name;
        }

        public async Task SetRoleNameAsync(UserRole role, string roleName, CancellationToken cancellationToken)
        {
            role.Name = roleName;
        }

        public async Task<UserRole> FindByIdAsync(string roleId, CancellationToken cancellationToken)
        {
            // Поиск роли по Id
            if (int.TryParse(roleId, out int roleIdAsInt))
            {
                return await _context.Set<UserRole>().SingleOrDefaultAsync(r => r.Id == roleIdAsInt, cancellationToken);
            }

            return null; // Если преобразование не удалось или roleId не является числом, вернем null или другой приемлемый результат.
        }

        public async Task<UserRole> FindByNameAsync(string roleName, CancellationToken cancellationToken)
        {
            // Поиск роли по имени
            return await _context.Set<UserRole>().SingleOrDefaultAsync(r => r.Name == roleName, cancellationToken);
        }

        // Реализация методов интерфейса IQueryableRoleStore<UserRole>

        public IQueryable<UserRole> Roles => _context.Set<UserRole>().AsQueryable();

        public async Task<IList<string>> GetRoleNamesAsync(UserRole role, CancellationToken cancellationToken)
        {
            // Возвращаем список названий ролей (в данном случае, у нас есть только одна роль)
            return new List<string> { role.Name };
        }

        public async Task AddToRoleAsync(UserRole user, string roleName, CancellationToken cancellationToken)
        {
            // Реализация добавления пользователя к роли
            var role = await FindByNameAsync(roleName, cancellationToken);
            if (role != null)
            {
                user.Id = role.Id;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task RemoveFromRoleAsync(UserRole user, string roleName, CancellationToken cancellationToken)
        {
            // Реализация удаления пользователя из роли
            var role = await FindByNameAsync(roleName, cancellationToken);
            if (role != null && user.Id == role.Id)
            {
                user.Id = 0;
                await _context.SaveChangesAsync(cancellationToken);
            }
        }

        public async Task<IList<UserRole>> GetRolesAsync(UserRole user, CancellationToken cancellationToken)
        {
            // Реализация получения роли пользователя (в данном случае, у пользователя есть только одна роль)
            var roles = new List<UserRole>();
            if (user.Id != null)
            {
                roles.Add(await FindByIdAsync(user.Id.ToString(), cancellationToken));
            }
            return roles;
        }

        public async Task<bool> IsInRoleAsync(UserRole user, string roleName, CancellationToken cancellationToken)
        {
            // Реализация проверки, находится ли пользователь в роли
            return user.Id != null && string.Equals(roleName, user.Name, StringComparison.OrdinalIgnoreCase);
        }

        public async void Dispose()
        {
          
        }

        public Task<string> GetNormalizedRoleNameAsync(UserRole role, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task SetNormalizedRoleNameAsync(UserRole role, string normalizedName, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}