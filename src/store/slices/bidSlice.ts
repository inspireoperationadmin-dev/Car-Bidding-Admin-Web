import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import apiClient from "../../api/client";

/*---------------- Bid Types ---------------- */
export interface BidDto {
  id: number;
  requestId: number;
  mechanicId: number;
  price: number;
  estimatedDurationDays: number;
  estimatedDurationHours: number;
  notes?: string;
  status: 'ACTIVE'| 'WITHDRAWN'| 'SELECTED'| 'REJECTED';
  createdAt: string | Date;
  updatedAt?: string | Date;
  mechanicName?: string; // Optional: Backend join panni anuppunaal
}
// export interface BidDto {
//     id: number;
//     requestId: number;
//     mechanicId: number;
//     price: number;
//     estimatedDurationDays: number;
//     estimatedDurationHours: number;
//     notes?: string;
//     status: 'ACTIVE'| 'WITHDRAWN'| 'SELECTED'| 'REJECTED';
//     createdAt: string|Date;
//     updatedAt: string|Date;
//     mechanicName?: any;
// }

export interface SelectMechanicDto {
  requestId: number;
  bidId: number;
}

/* ---- Request with Bids (Expandable View) ---- */
export interface RequestBidDto {
  id: number;
  mechanicId: number;
  mechanicName: string;
  mechanicEmail: string;
  price: number;
  estimatedDurationDays: number;
  estimatedDurationHours: number;
  notes: string | null;
  status: string;
  createdAt: string | Date;
}

export interface RequestWithBidsDto {
  id: number;
  carBrand: string;
  carModel: string;
  carYear: string;
  description: string;
  status: string;
  location: string | null;
  adminMaxPrice: number | null;
  createdAt: string | Date;
  customerName: string;
  bidCount: number;
  bids: RequestBidDto[];
}

/* ---------------- Bid State ---------------- */
export interface BidState {
  bids: BidDto[];
  selectedBid: BidDto | null;
  bidsForRequest: BidDto[];
  requestsWithBids: RequestWithBidsDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BidState = {
  bids: [],
  selectedBid: null,
  bidsForRequest: [],
  requestsWithBids: [],
  isLoading: false,
  error: null,
};

/* ---------------- Async Thunks ---------------- */

// 1. GET /bids - All Bids with Filters (Admin/Mechanic use seiyalaam)
export const fetchBids = createAsyncThunk<
  BidDto[],
  any,
  { rejectValue: string }
>("bids/getBids", async (filters, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("bids/getBids", { params: filters });
    return response.data.data; // Controller res.json({ success: true, data: bids }) anuppugirathu
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to load bids");
  }
});

// 2. GET /bids/request/:requestId - Specific Request-ukkana Bids
export const fetchBidsForRequest = createAsyncThunk<
  BidDto[],
  number,
  { rejectValue: string }
>("bids/getBidsForRequest", async (requestId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`/bids/getBidsForRequest/${requestId}`);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to load bids for this request");
  }
});

// 3. POST /bids/select - Customer selects a Mechanic/Bid
export const selectMechanic = createAsyncThunk<
  any,
  SelectMechanicDto,
  { rejectValue: string }
>("bids/selectMechanic", async (selectionData, { rejectWithValue, dispatch }) => {
  try {
    const response = await apiClient.post(`/bids/select`, selectionData);
    
    // Mechanic select seitha piragu, bids status maarum enpathaal refresh seigirom
    dispatch(fetchBidsForRequest(selectionData.requestId));
    
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to select mechanic");
  }
});

// 4. GET /bids/getRequestsWithBids - Requests with nested Bids (Expandable view)
export const fetchRequestsWithBids = createAsyncThunk<
  RequestWithBidsDto[],
  void,
  { rejectValue: string }
>("bids/getRequestsWithBids", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get("/bids/getRequestsWithBids");
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to load requests with bids");
  }
});

/* ---------------- Slice ---------------- */
const bidSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {
    setSelectedBid: (state, action: PayloadAction<BidDto | null>) => {
      state.selectedBid = action.payload;
    },
    clearBidError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Bids ---
      .addCase(fetchBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids = action.payload;
      })
      .addCase(fetchBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = null;
        console.log("Silent Error:", action.payload);
      })

      // --- Bids For Request ---
      .addCase(fetchBidsForRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBidsForRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bidsForRequest = action.payload;
      })

      // --- Select Mechanic ---
      .addCase(selectMechanic.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(selectMechanic.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(selectMechanic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Error selecting mechanic";
      })

      // --- Requests With Bids (Expandable View) ---
      .addCase(fetchRequestsWithBids.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRequestsWithBids.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requestsWithBids = action.payload;
      })
      .addCase(fetchRequestsWithBids.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Error loading requests with bids";
      });
  },
});

export const { setSelectedBid, clearBidError } = bidSlice.actions;
export default bidSlice.reducer;

/* ---------------- Selectors ---------------- */
export const selectAllBids = (state: RootState) => state.bids.bids;
export const selectBidsForRequest = (state: RootState) => state.bids.bidsForRequest;
export const selectRequestsWithBids = (state: RootState) => state.bids.requestsWithBids;
export const selectIsBidLoading = (state: RootState) => state.bids.isLoading;