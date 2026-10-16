// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '@/utils/api'; // Unga API client

// interface ReportsState {
//   revenueData: any;
//   requestData: any;
//   mechanicData: any;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ReportsState = {
//   revenueData: null,
//   requestData: null,
//   mechanicData: null,
//   loading: false,
//   error: null,
// };

// // Async Thunks with Filters
// export const fetchRevenueReport = createAsyncThunk(
//   'reports/fetchRevenue',
//   async (filters: { range: string }) => {
//     const response = await api.get('/reports/revenue', { params: filters });
//     return response.data;
//   }
// );

// export const fetchRequestReport = createAsyncThunk(
//   'reports/fetchRequests',
//   async (filters: { range: string; status?: string }) => {
//     const response = await api.get('/reports/requests', { params: filters });
//     return response.data;
//   }
// );

// export const fetchMechanicReport = createAsyncThunk(
//   'reports/fetchMechanics',
//   async (filters: { range: string; verifiedOnly?: boolean }) => {
//     const response = await api.get('/reports/mechanics', { params: filters });
//     return response.data;
//   }
// );

// const reportsSlice = createSlice({
//   name: 'reports',
//   initialState,
//   reducers: {
//     clearErrors: (state) => { state.error = null; }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addMatcher(
//         (action) => action.type.endsWith('/pending'),
//         (state) => { state.loading = true; state.error = null; }
//       )
//       .addMatcher(
//         (action) => action.type.endsWith('/fulfilled'),
//         (state, action) => {
//           state.loading = false;
//           if (action.type.includes('fetchRevenue')) state.revenueData = action.payload;
//           if (action.type.includes('fetchRequests')) state.requestData = action.payload;
//           if (action.type.includes('fetchMechanics')) state.mechanicData = action.payload;
//         }
//       )
//       .addMatcher(
//         (action) => action.type.endsWith('/rejected'),
//         (state, action) => {
//           state.loading = false;
//           state.error = action.error.message || 'Failed to fetch report';
//         }
//       );
//   },
// });

// export const { clearErrors } = reportsSlice.actions;
// export default reportsSlice.reducer;

import { createSlice, createAsyncThunk, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit';
import apiClient from '@/api/client';

interface ReportsState {
  revenueData: any;
  requestData: any;
  mechanicData: any;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  revenueData: null,
  requestData: null,
  mechanicData: null,
  loading: false,
  error: null,
};

export const fetchRevenueReport = createAsyncThunk('reports/fetchRevenue', async (filters: { range: string }) => {
  const response = await apiClient.get('/reports/revenue', { params: filters });
  return response.data.data;
});

export const fetchRequestReport = createAsyncThunk('reports/fetchRequests', async (filters: { range: string }) => {
  const response = await apiClient.get('/reports/requests', { params: filters });
  return response.data.data;
});

export const fetchMechanicReport = createAsyncThunk('reports/fetchMechanics', async (filters: { range: string }) => {
  const response = await apiClient.get('/reports/mechanics', { params: filters });
  return response.data.data;
});

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 1. All Pending Actions
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 2. All Fulfilled Actions - Error Fixed here
      .addMatcher(isFulfilled, (state, action) => {
        state.loading = false;
        const type = action.type;
        if (type.includes('fetchRevenue')) state.revenueData = action.payload;
        if (type.includes('fetchRequests')) state.requestData = action.payload;
        if (type.includes('fetchMechanics')) state.mechanicData = action.payload;
      })
      // 3. All Rejected Actions
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        if (action.error.message?.includes('404')) {
          state.error = null; 
        } else {
          state.error = action.error.message || 'Something went wrong';
        }
      });
  },
});

export default reportsSlice.reducer;