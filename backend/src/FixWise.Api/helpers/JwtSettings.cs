namespace FixWise.Api.Helpers;

public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public int ExpiryHours { get; set; } = 24;
}