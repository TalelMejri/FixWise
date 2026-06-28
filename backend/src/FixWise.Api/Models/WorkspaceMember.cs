using System.ComponentModel.DataAnnotations;

namespace FixWise.Api.Models;

public enum WorkspaceRole
{
    Owner,      
    Admin,     
    Member,     
    Technician, 
    Viewer   
}

public class WorkspaceMember
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid WorkspaceId { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    public WorkspaceRole Role { get; set; } = WorkspaceRole.Member;
    
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? InvitedAt { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    // Relations
    public Workspace Workspace { get; set; } = null!;
    public User User { get; set; } = null!;
}