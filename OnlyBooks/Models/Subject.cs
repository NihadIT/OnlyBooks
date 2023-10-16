using System;
using System.Collections.Generic;

namespace OnlyBooks.Models
{
    public partial class Subject
    {
        public Subject()
        {
            Books = new HashSet<Book>();
        }

        public int SubjectId { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Book> Books { get; set; }
    }
}
