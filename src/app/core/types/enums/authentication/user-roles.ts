export enum UserRoles {
  ProjectManager = 'projectManager',
  TeamLead = 'teamLead',
  Developer = 'developer',
}

export const UserRolesTranslationKeys = {
  [UserRoles.ProjectManager]: 'USER_ROLES.PROJECT_MANAGER',
  [UserRoles.TeamLead]: 'USER_ROLES.TEAM_LEAD',
  [UserRoles.Developer]: 'USER_ROLES.DEVELOPER',
};
