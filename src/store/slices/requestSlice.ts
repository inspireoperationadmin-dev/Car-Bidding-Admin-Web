//  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../index";
// import apiClient from "../../api/client";
// import type { RequestDto } from "@/components/requests/RequestTable";

// /*---------------- Request Types ---------------- */
// // export interface RequestDto {
// //   id: number;
// //   customerName: string;
// //   customerEmail: string;
// //   carBrand: string;
// //   carModel: string;
// //   carYear: number;
// //   status: 'Pending' | 'Approved' | 'Rejected' | 'Bidding' | 'Completed';
// //   adminMaxPrice: number;
// //   createdAt: string;
// // }

// export interface ReviewRequestDto {
//   requestId: number;
//   status: string;
//   adminMaxPrice: number;
//   notes?: string;
// }

// /* ---------------- Request State ---------------- */
// export interface RequestState {
//   requests: RequestDto[];
//   selectedRequest: RequestDto | null;
//   isLoading: boolean;
//   error: string | null;
// }

// /* ---------------- Initial State ---------------- */
// const initialState: RequestState = {
//   requests: [],
//   selectedRequest: null,
//   isLoading: false,
//   error: null,
// };

// /* --------- Async Thunks ----------- */

// // 1. Fetch All Requests
// export const fetchRequests = createAsyncThunk<
//   RequestDto[],
//   any,
//   { rejectValue: string }
// >("request/getAll", async (filters, { rejectWithValue }) => {
//   try {
//     // AuthSlice-la use panna maari apiClient moolam fetch panrom
//     const response = await apiClient.get("/requests", { params: filters });
    
//     // Backend response structure-ai poruthu 'response.data.data' allathu 'response.data' use pannunga
//     return response.data.data || response.data;
//   } catch (error: any) {
//     return rejectWithValue(
//       error.response?.data?.message || "Failed to load requests"
//     );
//   }
// });

// // 2. Review/Update Request
// export const reviewRequest = createAsyncThunk<
//   RequestDto,
//   ReviewRequestDto,
//   { rejectValue: string }
// >("request/review", async ({ requestId, ...reviewData }, { rejectWithValue, dispatch }) => {
//   try {
//     const response = await apiClient.post(`/requests/${requestId}/review`, reviewData);
    
//     // Success aana udanae list-ai refresh pannuvom
//     dispatch(fetchRequests({})); 
    
//     return response.data.data || response.data;
//   } catch (error: any) {
//     return rejectWithValue(
//       error.response?.data?.message || "Failed to submit review"
//     );
//   }
// });

// /* ---------------- Slice ---------------- */
// const requestSlice = createSlice({
//   name: "requests",
//   initialState,
//   reducers: {
//     setSelectedRequest: (state, action: PayloadAction<RequestDto | null>) => {
//       state.selectedRequest = action.payload;
//     },
//     clearRequestError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // --- Fetch Requests Case ---
//       .addCase(fetchRequests.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchRequests.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.requests = action.payload;
//       })
//       .addCase(fetchRequests.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload ?? "Something went wrong";
//       })
      
//       // --- Review Request Case ---
//       .addCase(reviewRequest.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(reviewRequest.fulfilled, (state) => {
//         state.isLoading = false;
//         // reviewRequest-la already dispatch(fetchRequests) senjathala inga requests update panna thevai illai
//       })
//       .addCase(reviewRequest.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload ?? "Failed to update request";
//       });
//   },
// });

// /* ---------------- Exports ---------------- */
// export const { setSelectedRequest, clearRequestError } = requestSlice.actions;
// export default requestSlice.reducer;

// /* ---------------- Selectors ---------------- */
// export const selectRequests = (state: RootState) => state.requests.requests;
// export const selectRequestLoading = (state: RootState) => state.requests.isLoading;
// export const selectRequestError = (state: RootState) => state.requests.error;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import apiClient from "../../api/client";
import type { RequestDto } from "@/components/requests/RequestTable";

/*---------------- Request Types ---------------- */

// Backend Controller-il உள்ள ReviewRequestDto-க்கு ஏற்றவாறு மாற்றம் செய்யப்பட்டுள்ளது
export interface ReviewRequestDto {
  requestId: number;
  action: 'APPROVE' | 'REJECT' |'REQUEST_CHANGES'; // Backend expects this
  maxPrice?: number;            // Backend uses 'maxPrice'
  notes?: string;
  rejectionReason?: string;    // Backend has this field
}

/* ---------------- Request State ---------------- */
export interface RequestState {
  requests: RequestDto[];
  selectedRequest: RequestDto | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
}

/* ---------------- Initial State ---------------- */
const initialState: RequestState = {
  requests: [],
  selectedRequest: null,
  isLoading: false,
  error: null,
  pagination: null
};

/* --------- Async Thunks ----------- */

// 1. Fetch All Requests (Backend pagination support-உடன்)
export const fetchRequests = createAsyncThunk<
  { data: RequestDto[], pagination: any },
  any,
  { rejectValue: string }
>("request/getAll", async (filters, { rejectWithValue }) => {
  try {
    // Only send params that the backend understands; exclude 'ALL' status and empty values
    const params: Record<string, any> = {};
    if (filters?.status && filters.status !== 'ALL' && filters.status !== 'UNDER_REVIEW') params.status = filters.status;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const response = await apiClient.get("/requests", { params });
    console.log("Check API Response:", response.data);
    // Backend return செய்வது: { success: true, data: [...], pagination: {...} }
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to load requests"
    );
  }
});

// 2. Review Request (Backend review(req, res) method-க்கு ஏற்றவாறு)
export const reviewRequest = createAsyncThunk<
  any,
  ReviewRequestDto,
  { rejectValue: string }
>("request/review", async ({ requestId, ...reviewData }, { rejectWithValue, dispatch }) => {
  try {
    // URL: /requests/:id/review
    const response = await apiClient.post(`/requests/${requestId}/review`, reviewData);
    
    // Success ஆனவுடன் லிஸ்ட்டை ரீப்ரெஷ் செய்கிறோம்
    dispatch(fetchRequests({})); 
    
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to submit review"
    );
  }
});

/* ---------------- Slice ---------------- */
const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setSelectedRequest: (state, action: PayloadAction<RequestDto | null>) => {
      state.selectedRequest = action.payload;
    },
    clearRequestError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Requests ---
      .addCase(fetchRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      
      // --- Review Request ---
      .addCase(reviewRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reviewRequest.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(reviewRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to update request";
      });
  },
});

/* ---------------- Exports ---------------- */
export const { setSelectedRequest, clearRequestError } = requestSlice.actions;
export default requestSlice.reducer;

/* ---------------- Selectors ---------------- */
export const selectRequests = (state: RootState) => state.requests.requests;
export const selectPagination = (state: RootState) => state.requests.pagination;
export const selectRequestLoading = (state: RootState) => state.requests.isLoading;
export const selectRequestError = (state: RootState) => state.requests.error;