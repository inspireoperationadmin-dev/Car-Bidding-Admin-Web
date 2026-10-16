  import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import requestReducer from './slices/requestSlice';
import bidReducer from './slices/bidSlice';
import paymentReducer from './slices/paymentSlice';
import userReducer from './slices/userSlice';
import dashboardReducer from './slices/dashboardSlice';
import reportsReducer from './slices/reportsSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestReducer,
    bids: bidReducer,
    payments: paymentReducer,
    users: userReducer,
    dashboard: dashboardReducer,
    reports: reportsReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
