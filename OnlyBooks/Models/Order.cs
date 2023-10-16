using System;
using System.Collections.Generic;

namespace OnlyBooks.Models
{
    public partial class Order
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public string? ShippingAddress { get; set; }

        public virtual User? User { get; set; }
    }
}
