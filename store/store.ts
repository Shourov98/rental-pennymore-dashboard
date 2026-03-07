import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import adminRequestsReducer from "./adminRequestsSlice";
import renterConnectionReducer from "./renterConnectionSlice";
import agentManagementReducer from "./agentManagementSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminRequests: adminRequestsReducer,
    renterConnection: renterConnectionReducer,
    agentManagement: agentManagementReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
