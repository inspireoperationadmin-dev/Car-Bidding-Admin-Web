import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
 import apiClient from '@/api/client';

// --- Types ---
export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
 isActive: boolean;    // ✅ 'status' ku pathilaaga
  createdDate: string;
}

interface UserState {
  users: UserDto[];
  selectedUser: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

// --- Async Thunks ---

// 1. Fetch Users with filters
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (filters: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/users', { params: filters });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// 2. Fetch Detailed User Profile
export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

// 3. Toggle Account Status (Active/Inactive)
export const toggleUserStatus = createAsyncThunk(
  'users/toggleStatus',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.patch(`/users/${id}/toggle-status`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// 4. Mechanic Verification: Approve
export const approveMechanic = createAsyncThunk(
  'users/approveMechanic',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/mechanics/verification/${id}/approve`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Approval failed');
    }
  }
);

// 5. Mechanic Verification: Reject
export const rejectMechanic = createAsyncThunk(
  'users/rejectMechanic',
  async ({ id, reason }: { id: number; reason: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/mechanics/verification/${id}/reject`, { reason });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Rejection failed');
    }
  }
);

// --- Slice Definition ---
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Detailed User
      .addCase(fetchUserById.pending, (state) => { state.loading = true; })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state) => { state.loading = false; });
  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;