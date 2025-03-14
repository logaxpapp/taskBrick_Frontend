export interface Permission {
    _id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Role {
    _id: string;
    name: string;
    permissions: Permission[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  /** Payload for creating/updating a Permission. */
  export interface CreatePermissionPayload {
    name: string;
    description?: string;
  }
  
  /** Payload for creating/updating a Role. */
  export interface CreateRolePayload {
    name: string;
    permissionIds: string[];
  }
  