using System.ComponentModel.DataAnnotations;

namespace FixWise.Api.Models;

public enum WorkspaceType
{
    Personal,
    Family,
    Business
}

public class Workspace
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    public WorkspaceType Type { get; set; } = WorkspaceType.Personal;
    
    public string? Description { get; set; }
    
    public Guid CreatedByUserId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    // Relations
    public User CreatedByUser { get; set; } = null!;
    public ICollection<WorkspaceMember> Members { get; set; } = new List<WorkspaceMember>();
}