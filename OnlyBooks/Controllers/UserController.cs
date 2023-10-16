using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlyBooks.Models;
using OnlyBooks.ViewModel;
using Microsoft.AspNetCore.Identity;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;

namespace OnlyBooks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : Controller
    {
        private OnlyBooksContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<UserController> _logger;

        public UserController(OnlyBooksContext context,
            UserManager<User> userManager, SignInManager<User> signInManager, ILogger<UserController> logger)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_context.Users.Any(u => u.Email == model.Email))
            {
                ModelState.AddModelError("Email", "Пользователь с таким email уже существует.");
                return BadRequest(ModelState);
            }

            var user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                Phone = model.Phone,
                Address = model.Address,
                UserName = model.LastName,
                Password = model.Password,
                Role = "Client" 
            };
            var result = await _userManager.CreateAsync(user, model.Password);  // Добавляет пользователя в базу

            if (result.Succeeded)
            {
                // Пользователь успешно зарегистрирован
                return Ok(new { Message = "Пользователь успешно зарегистрирован." });
            }
            else
            {
                // Обработка ошибок регистрации
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return BadRequest(ModelState);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Найдите пользователя по email
            var user = await _userManager.FindByEmailAsync(model.Email);
            _logger.LogInformation("Почта пользователя: " + model.Email);

            if (user == null)
            {
                ModelState.AddModelError("Email", "Пользователь с таким email не найден.");
                return new JsonResult(new { error = "Пользователь с таким email не найден." }) { StatusCode = 400 };
            }

            // Попытка входа пользователя
            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                // Успешный вход
                return Ok(new
                {
                    user.Id,
                    user.Email,
                    user.Password,
                    user.FirstName,
                    user.LastName,
                    user.Address,
                    user.Phone,
                    user.Role,
                    user.ImageUrl
                });
            }
            else
            {
                ModelState.AddModelError("Password", "Неверный пароль.");
                return new JsonResult(new { error = "Неверный пароль." }) { StatusCode = 400 };
            }
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return NotFound();
            }

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Phone = model.Phone;
            user.Address = model.Address;
            user.Email = model.Email;

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpPost]
        [Route("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile image, string userEmail)
        {
            if (image == null)
            {
                return BadRequest("No image provided.");
            }

            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("User not authenticated.");
            }

            var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;

            // Уникальную папка для каждого пользователя
            var userImagesPath = Path.Combine("wwwroot/img/profiles", userEmail);
            Directory.CreateDirectory(userImagesPath);

            var imagePath = Path.Combine(userImagesPath, uniqueFileName);
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var user = await _userManager.FindByEmailAsync(userEmail);
            if (user != null && !string.IsNullOrEmpty(user.ImageUrl))
            {
                var oldImagePath = Path.Combine("wwwroot", user.ImageUrl.TrimStart('/'));
                if (System.IO.File.Exists(oldImagePath))
                {
                    System.IO.File.Delete(oldImagePath);
                }
            }

            user.ImageUrl = $"/img/profiles/{userEmail}/{uniqueFileName}";

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                var imageUrl = $"/img/profiles/{userEmail}/{uniqueFileName}";
                return Ok(imageUrl);
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpGet]
        [Route("GetOrdersByUserId")]
        public async Task<IActionResult> GetOrdersByUserId(int id)
        {
            var orders = await _context.Orders.Where(order => order.UserId == id).ToListAsync();

            if (orders == null)
            {
                return NotFound("История заказов пуста");
            }

            return  Ok(orders);
        }

    }

}

