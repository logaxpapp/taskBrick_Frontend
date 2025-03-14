// src/types/permissionMappingTypes.ts
export interface PermissionMapping {
    _id: string;
    route: string;          // e.g. '/:id'
    method: string;         // e.g. 'DELETE'
    permissionName: string; // e.g. 'project.delete'
    createdAt?: string;     // optional
    updatedAt?: string;     // optional
  }
  