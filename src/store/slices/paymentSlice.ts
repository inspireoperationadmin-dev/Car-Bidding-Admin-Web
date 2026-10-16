import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from "../../api/client";

export interface PaymentDto {
  id: number; 
  requestId: number;
  customerId: number;
  customerName?: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CARD' | 'PAYPAL' | 'SEPA' | 'APPLE_PAY' | 'GOOGLE_PAY' | string;
  createdAt: string | Date;
  clientSecret?: string;  // Optional: Backend-il irunthu join panni vanthaal
}
 

interface PaymentState {
  payments: PaymentDto[];
  selectedPayment: PaymentDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  selectedPayment: null,
  isLoading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk(
    //ethu ku enum end point vaarela
  'payments/fetchAll',
  async (filters: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('payments/getPaymentStatus', { params: filters });
      return response.data.data; // Success: true, Data: [...]
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/getPaymentStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/payments/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error loading details');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearSelectedPayment: (state) => {
      state.selectedPayment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.selectedPayment = action.payload;
      });
  },
});

export const { clearSelectedPayment } = paymentSlice.actions;
export default paymentSlice.reducer;