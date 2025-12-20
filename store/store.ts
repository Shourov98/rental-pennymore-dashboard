import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import adminRequestsReducer from "./adminRequestsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminRequests: adminRequestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
