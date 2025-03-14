// File: src/types/userTypes.ts

import { Role } from './rolePermissionTypes';

export interface User {
  
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string | Role;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  profileImage?: string | null;
}
