 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import apiClient from "../../api/client";

/* ---------------- Role & User Types ---------------- */
export type Role = "ADMIN" | "STAFF" | "CUSTOMER" | "MECHANIC";

export interface UserDto {
  id: number;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

/* ---------------- Auth State ---------------- */
export interface AuthState {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/* ---------------- Initial State ---------------- */
const storedUser = localStorage.getItem("authUser");
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem("authToken"),
  isAuthenticated: !!localStorage.getItem("authToken"),
  isLoading: false,
  error: null,
};

/* ---------------- Async Thunks ---------------- */
export const loginThunk = createAsyncThunk<
  { user: UserDto; token: string },
  LoginDto,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    console.log(response)

    // ✅ BACKEND RESPONSE SAFE HANDLING
    const user: UserDto | undefined = response.data.data.user;
    const token: string | undefined =
      response.data.data.token ||
      response.data.data.accessToken ||
      response.data.data.jwt;

    if (!user || !token) {
      return rejectWithValue("Invalid login response from server");
    }

    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      return rejectWithValue("Access denied. Admin or Staff credentials required.");
    }

    localStorage.setItem("authToken", token);
    const refreshToken = response.data.data.refreshToken;
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("authUser", JSON.stringify(user));

    return { user, token };
  } catch (error: any) {
    console.log(error)
    if (error.response?.status === 401) {
      return rejectWithValue("Invalid email or password");
    }

    if (!error.response) {
      return rejectWithValue("Server Down");
    }

    return rejectWithValue(
      error.response?.data?.message || "Login failed"
    );
  }
});

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
});

/* ---------------- Slice ---------------- */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Login failed";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

/* ---------------- Exports ---------------- */
export const { logout, setError } = authSlice.actions;
export default authSlice.reducer;

/* ---------------- Selectors ---------------- */
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;
 