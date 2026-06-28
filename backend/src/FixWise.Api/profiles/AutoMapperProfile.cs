using AutoMapper;
using FixWise.Api.DTOs.Auth;
using FixWise.Api.Models;

namespace FixWise.Api.Profiles;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // User mappings
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Workspaces, 
                opt => opt.MapFrom(src => src.WorkspaceMembers
                    .Where(wm => wm.IsActive)
                    .Select(wm => new WorkspaceDto
                    {
                        Id = wm.Workspace.Id,
                        Name = wm.Workspace.Name,
                        Type = wm.Workspace.Type.ToString(),
                        Role = wm.Role.ToString()
                    })));

        CreateMap<RegisterRequest, User>()
            .ForMember(dest => dest.PasswordHash, 
                opt => opt.Ignore());
    }
}