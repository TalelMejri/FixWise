using FixWise.Api.DTOs.Auth;

namespace FixWise.Api.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<UserDto> GetCurrentUserAsync(Guid userId);
    Task<bool> ValidateTokenAsync(string token);
    Task LogoutAsync(Guid userId);
}