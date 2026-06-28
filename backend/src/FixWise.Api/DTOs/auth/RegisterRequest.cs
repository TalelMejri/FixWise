using System.ComponentModel.DataAnnotations;

namespace FixWise.Api.DTOs.Auth;

public class RegisterRequest
{
    [Required(ErrorMessage = "Le nom complet est requis")]
    [MaxLength(100, ErrorMessage = "Le nom ne peut pas dépasser 100 caractères")]
    public string FullName { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "L'email est requis")]
    [EmailAddress(ErrorMessage = "Format d'email invalide")]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Le mot de passe est requis")]
    [MinLength(8, ErrorMessage = "Le mot de passe doit faire au moins 8 caractères")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$", 
        ErrorMessage = "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre")]
    public string Password { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "La confirmation du mot de passe est requise")]
    [Compare("Password", ErrorMessage = "Les mots de passe ne correspondent pas")]
    public string ConfirmPassword { get; set; } = string.Empty;
}