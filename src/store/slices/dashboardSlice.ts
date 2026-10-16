// 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

// Interfaces for Type Safety
export interface DashboardState {
  metrics: {
    totalRequests: number;
    activeUsers: number;
    totalRevenue: number;
    recentActivities: any[];
    topMechanics: any[];
  } | null;
  analytics: any[]; // Combined analytics data
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  analytics: [],
  loading: false,
  error: null,
};

// --- Async Thunks ---

// 1. Fetch Summary Metrics

export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/dashboard/getMetrics');
      return response.data; // { totalRequests, activeUsers, etc. }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch metrics');
    }
  }
);

// 2. Fetch All Dashboard Data (Metrics + Analytics)
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchAllData',
  async (params: { startDate?: string; endDate?: string } | undefined, { rejectWithValue }) => {
    try {
      console.log('[Dashboard] Fetching dashboard data...');
      // Parallel API calls for better performance
      const [metricsRes, analyticsRes] = await Promise.all([
        apiClient.get('/dashboard/getMetrics'),
        apiClient.get('/dashboard/getAnalytics', { params }),
      ]);

      console.log('[Dashboard] Metrics response:', metricsRes.data);
      console.log('[Dashboard] Analytics response:', analyticsRes.data);

      return {
        metrics: metricsRes.data,
        analytics: analyticsRes.data,
      };
    } catch (err: any) {
      console.error('[Dashboard] Fetch error:', err.response?.status, err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle Metrics
      .addCase(fetchDashboardMetrics.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle All Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.analytics = action.payload.analytics;
        // Store metrics with all enriched fields
        const m = action.payload.metrics;
        state.metrics = {
          totalRequests: m?.totalRequests || 0,
          activeUsers: m?.activeUsers || 0,
          totalRevenue: m?.totalRevenue || 0,
          recentActivities: m?.recentActivities || [],
          topMechanics: m?.topMechanics || [],
        };
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;