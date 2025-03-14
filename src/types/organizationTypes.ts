// File: src/types/organizationTypes.ts
export interface Organization {
    _id: string;
    name: string;
    description?: string | null;
    ownerUserId?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }
  