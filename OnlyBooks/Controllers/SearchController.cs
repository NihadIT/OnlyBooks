using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OnlyBooks.Models;
using System.Linq;

namespace OnlyBooks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : Controller
    {
        private OnlyBooksContext _dbContext;
        private readonly ILogger<SearchController> _logger;

        public SearchController(OnlyBooksContext dbContext, ILogger<SearchController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        [HttpGet]
        [Route("SearchBooks")]
        public IActionResult SearchBooks(string searchTerm)
        {
            _logger.LogInformation($"SearchBooks called with searchTerm: {searchTerm}");

            var searchResults = _dbContext.Books
                .Include(b => b.Authors)
                .Include(b => b.Discounts)
                .Where(book => book.Title.Contains(searchTerm))
                .ToList();

            var booksWithPrices = searchResults.Select(book =>
            {
                decimal priceWithDiscount = book.Price;

                // Проверяем, есть ли у книги скидка
                var discount = book.Discounts.FirstOrDefault(d => d.BookId == book.BookId );
                if (discount != null)
                {
                    // Если есть скидка, применяем ее к цене
                    priceWithDiscount = book.Price * (1 - discount.DiscountPercentage / 100);
                }

                return new
                {
                    BookId = book.BookId,
                    Title = book.Title,
                    PriceWithDiscount = (int)Math.Floor(priceWithDiscount),
                    CoverImage = book.CoverImage
                };
            });

            return Ok(booksWithPrices);
        }
    }
}
