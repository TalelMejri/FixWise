using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using FixWise.Api.Data;
using FixWise.Api.DTOs.Auth;
using FixWise.Api.Models;
using FixWise.Api.Services.Interfaces;
using FixWise.Api.Helpers;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace FixWise.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        AppDbContext context,
        IMapper mapper,
        IOptions<JwtSettings> jwtSettings)
    {
        _context = context;
        _mapper = mapper;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Vérifier si l'email existe déjà
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            throw new InvalidOperationException("Un utilisateur avec cet email existe déjà.");
        }

        // Créer l'utilisateur
        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        // Créer un workspace personnel par défaut
        var workspace = new Workspace
        {
            Name = $"Workspace de {user.FullName}",
            Type = WorkspaceType.Personal,
            CreatedByUserId = user.Id,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Workspaces.AddAsync(workspace);
        await _context.SaveChangesAsync();

        // Ajouter l'utilisateur comme Owner du workspace
        var member = new WorkspaceMember
        {
            WorkspaceId = workspace.Id,
            UserId = user.Id,
            Role = WorkspaceRole.Owner,
            JoinedAt = DateTime.UtcNow
        };

        await _context.WorkspaceMembers.AddAsync(member);
        await _context.SaveChangesAsync();

        // Générer le token
        var token = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token = token,
            RefreshToken = GenerateRefreshToken(),
            User = _mapper.Map<UserDto>(user)
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Rechercher l'utilisateur avec ses workspaces
        var user = await _context.Users
            .Include(u => u.WorkspaceMembers)
                .ThenInclude(wm => wm.Workspace)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Email ou mot de passe incorrect.");
        }

        // Vérifier le mot de passe
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Email ou mot de passe incorrect.");
        }

        // Mettre à jour la date de dernière connexion
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Générer le token
        var token = GenerateJwtToken(user);

        return new AuthResponse
        {
            Token = token,
            RefreshToken = GenerateRefreshToken(),
            User = _mapper.Map<UserDto>(user)
        };
    }

    public async Task<UserDto> GetCurrentUserAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.WorkspaceMembers)
                .ThenInclude(wm => wm.Workspace)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new KeyNotFoundException("Utilisateur non trouvé.");
        }

        return _mapper.Map<UserDto>(user);
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out _);

            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task LogoutAsync(Guid userId)
    {
        await Task.CompletedTask;
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.GlobalRole)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryHours),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Convert.ToBase64String(Guid.NewGuid().ToByteArray());
    }
}