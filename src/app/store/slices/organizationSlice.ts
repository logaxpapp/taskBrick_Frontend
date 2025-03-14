// File: src/store/slices/organizationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type OrganizationState = {
  selectedOrgId: string | null;
  selectedOrgName: string | null;
};

const initialState: OrganizationState = {
  selectedOrgId: null,
  selectedOrgName: null,
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setSelectedOrg: (
      state,
      action: PayloadAction<{
        selectedOrgId: string | null;
        selectedOrgName: string | null;
      }>
    ) => {
      const { selectedOrgId, selectedOrgName } = action.payload;
      state.selectedOrgId = selectedOrgId;
      state.selectedOrgName = selectedOrgName;
    },
  },
});

export const { setSelectedOrg } = organizationSlice.actions;
export default organizationSlice.reducer;
