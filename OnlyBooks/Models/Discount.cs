using System;
using System.Collections.Generic;

namespace OnlyBooks.Models
{
    public partial class Discount
    {
        public int DiscountId { get; set; }
        public int BookId { get; set; }
        public decimal DiscountPercentage { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public virtual Book Book { get; set; } = null!;
    }
}
