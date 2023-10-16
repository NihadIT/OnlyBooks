using System.ComponentModel.DataAnnotations;

public class UpdateUserViewModel
{
    [Required]
    public string Email { get; set; }

    [Required]
    public string FirstName { get; set; }

    [Required]
    public string LastName { get; set; }

    [Required]
    public string Phone { get; set; }

    [Required]
    public string Address { get; set; }

}
