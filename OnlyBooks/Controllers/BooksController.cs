using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlyBooks.Models;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Collections.Generic;
using System.Security.Claims;

namespace OnlyBooks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : Controller
    {
        private OnlyBooksContext _сontext;

        public BooksController(OnlyBooksContext dbContext)
        {
            _сontext = dbContext; 
        }

        [HttpGet]
        [Route("GetBooks")]
        public IActionResult GetBooks()
        {
            List<Book> books = _сontext.Books.ToList();
            return StatusCode(StatusCodes.Status200OK, books);
        }

        [HttpGet]
        [Route("GetBookById")]
        public IActionResult GetBookById(int? bookId)
        {
            var book = _сontext.Books.FirstOrDefault(b => b.BookId == bookId);
            return StatusCode(StatusCodes.Status200OK, book);
        }

        [HttpGet]
        [Route("GetBooksPagination")]
        public IActionResult GetBooksPagination(int? subjectId, int? subjectMin, int? categoryId, int? minRate, int? year, int? _page, int? _limit, string? sort)
        {
            int pageNumber = _page ?? 1;
            int pageSize = _limit ?? 10;

            IQueryable<Book> booksQuery = _сontext.Books;
            booksQuery = _сontext.Books.Include(b => b.Discounts);

            // Применяем фильтр по предмету (subjectId)
            if (subjectId.HasValue)
            {
                booksQuery = booksQuery.Where(b => b.SubjectId == subjectId);
            }

            if (subjectMin.HasValue)
            {
                booksQuery = booksQuery.Where(b => b.SubjectId >= subjectMin);
            }

            // Применяем фильтр по категории (categoryId)
            if (categoryId.HasValue)
            {
                List<int> bookIdsInCategory = _сontext.BookCategories
                    .Where(bc => bc.CategoryId == categoryId)
                    .Select(bc => bc.BookId.Value)
                    .ToList();

                booksQuery = booksQuery.Where(b => bookIdsInCategory.Contains(b.BookId));
            }

            // Применяем фильтр по минимальному рейтингу (minRate)
            if (minRate.HasValue)
            {
                booksQuery = booksQuery.Where(b => b.Rate >= minRate);
            }

            if (year.HasValue)
            {
                booksQuery = booksQuery.Where(b => b.PublicationYear == year);
            }

            int totalBooks = booksQuery.Count();

            // Общее количество книг
            Response.Headers.Add("X-Total-Books", totalBooks.ToString());

            if (sort != null)
            {
                booksQuery = SortBook(booksQuery, sort);
            }

            List<Book> books = booksQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            return StatusCode(StatusCodes.Status200OK, books);
        }

        // Сортировка книг
        private IQueryable<Book> SortBook(IQueryable<Book> booksQuery, string sort)
        {
            if (!string.IsNullOrEmpty(sort))
            {
                if (sort == "date-down")
                {
                    booksQuery = booksQuery.OrderByDescending(b => b.PublicationYear);
                }
                else if (sort == "date-up")
                {
                    booksQuery = booksQuery.OrderBy(b => b.PublicationYear);
                }
                else if(sort == "rate-down")
                {
                    booksQuery = booksQuery.OrderByDescending(b => b.Rate);
                }
                else if (sort == "rate-up")
                {
                    booksQuery = booksQuery.OrderBy(b => b.Rate);
                }
                else if (sort == "price-down")
                {
                    booksQuery = booksQuery.OrderByDescending(b => b.Price);
                }
                else if (sort == "price-up")
                {
                    booksQuery = booksQuery.OrderBy(b => b.Price);
                }
            }

            return booksQuery; ;
        }

        [HttpGet]
        [Route("GetDiscounts")]
        public IActionResult GetDiscounts()
        {
            List<Discount> discounts = _сontext.Discounts.ToList();
            return StatusCode(StatusCodes.Status200OK, discounts);
        }

        [HttpGet]
        [Route("GetDiscountById")]
        public IActionResult GetDiscountById(int? bookId)
        {
            var discount = _сontext.Discounts.FirstOrDefault(d => d.BookId == bookId);
            return StatusCode(StatusCodes.Status200OK, discount);
        }

        // Получить автора по bookId
        [HttpGet]
        [Route("GetAuthors")]
        public IActionResult GetAuthorsById(int? bookId)
        {
            var book = _сontext.Books
               .Include(b => b.Authors)
               .FirstOrDefault(b => b.BookId == bookId);

            if (book == null)
            {
                return NotFound();
            }

            var authors = book.Authors.Select(a => new
            {
                a.AuthorId,
                a.FirstName,
                a.LastName,
                
            });

            return StatusCode(StatusCodes.Status200OK, authors);
        }

        [HttpGet]
        [Route("GetCategoryById")]
        public IActionResult GetCategoryById(int? bookId)
        {
            if (bookId == null)
            {
                return BadRequest("Книга не найдена");
            }

            var bookCategories = _сontext.BookCategories
                .Where(bc => bc.BookId == bookId)
                .Select(bc => bc.CategoryId)
                .ToList();

            if (bookCategories.Count == 0)
            {
                return NotFound("Категорий не найдено");
            }

            var categories = _сontext.Categories
            .Where(c => bookCategories.Contains(c.CategoryId))
            .ToList();

            return StatusCode(StatusCodes.Status200OK, categories);
        }

        [HttpGet]
        [Route("GetGenreById")]
        public IActionResult GetGenreById(int? bookId)
        {
            var book = _сontext.Books
                 .Include(b => b.Genres)
                 .FirstOrDefault(b => b.BookId == bookId);

            if (book == null)
            {
                return NotFound();
            }

            var genres = book.Genres.Select(a => new
            {
                a.GenreId,
                a.Name,
            });

            return StatusCode(StatusCodes.Status200OK, genres);
        }

        [HttpPost]
        [Route("PostOrder")]
        public IActionResult PostOrder([FromBody] Order order)
        {
            try
            {
                if (string.IsNullOrEmpty(order.ShippingAddress))
                {
                   order.ShippingAddress = "Адрес уточняется";
                }

                _сontext.Orders.Add(order);
                _сontext.SaveChanges();

                return Ok("Заказ успешно создан.");
            }
            catch (Exception ex)
            {
                // Обработка ошибок
                return BadRequest($"Ошибка при создании заказа: {ex.Message}");
            }
        }


    }
}
