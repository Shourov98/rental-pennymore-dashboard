import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import adminRequestsReducer from "./adminRequestsSlice";
import renterConnectionReducer from "./renterConnectionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminRequests: adminRequestsReducer,
    renterConnection: renterConnectionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
