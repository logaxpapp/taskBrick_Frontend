// File: src/contexts/OrgContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface OrgContextValue {
  selectedOrgId: string | null;
  selectedOrgName: string | null;
  setSelectedOrg: (orgId: string | null, orgName: string | null) => void;
}

const OrgContext = createContext<OrgContextValue | undefined>(undefined);

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [{ selectedOrgId, selectedOrgName }, setOrgState] = useState<{
    selectedOrgId: string | null;
    selectedOrgName: string | null;
  }>({
    selectedOrgId: null,
    selectedOrgName: null,
  });

  const setSelectedOrg = (orgId: string | null, orgName: string | null) => {
    setOrgState({ selectedOrgId: orgId, selectedOrgName: orgName });
  };

  return (
    <OrgContext.Provider value={{ selectedOrgId, selectedOrgName, setSelectedOrg }}>
      {children}
    </OrgContext.Provider>
  );
};

export function useOrgContext(): OrgContextValue {
  const ctx = useContext(OrgContext);
  if (!ctx) {
    throw new Error('useOrgContext must be used within an OrgProvider');
  }
  return ctx;
}

// For convenience
export function useSelectedOrgId(): string | null {
  return useOrgContext().selectedOrgId;
}
export function useSelectedOrgName(): string | null {
  return useOrgContext().selectedOrgName;
}
