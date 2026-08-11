import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiClient } from "@/lib/apiClient";
import type { RootState } from "./store";

export type AdminRequestScope = "Upcoming" | "All Market";

export type AdminRequest = {
  _id: string;
  id: string;
  requestId: string;
  requestName: string;
  createdAt: string;
  status?: "Available" | "pending" | "paid" | "free" | "rejected";
  scope?: AdminRequestScope;
  visibility?: "PRIVATE" | "SHARED";
  marketScopeSwitchLocked?: boolean;
  marketScopeSwitchLockedReason?: string | null;
  renterInfo?: {
    renterId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImageUrl?: string;
    registrationType?: string;
    referralInfo?: {
      referrerId?: string;
      referrerName?: string;
      referrerType?: string;
    };
  };
  locations?: Array<{
    borough?: string;
    neighborhoods?: string[];
  }>;
  priceRange?: {
    min?: number;
    max?: number;
  };
  bedrooms?: string[];
  bathrooms?: string[];
  agentRequestSummary?: {
    total?: number;
    approve?: number;
    pending?: number;
  };
  agentRequests?: Array<{
    _id: string;
    status: "pending" | "approved" | "rejected";
    agentId?: string;
    agent?: {
      agentId?: string;
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      role?: string;
      profileImageUrl?: string;
    };
    requestedAt?: string;
    payment?: {
      amount?: number;
      currency?: string;
      status?: "pending" | "paid" | "free";
    };
  }>;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
  slNo: number;
};

type FetchRequestsResponse = {
  success: boolean;
  message: string;
  data: AdminRequest[];
  pagination: Pagination;
  timestamp: string;
};

type AdminRequestsState = {
  items: AdminRequest[];
  pagination: Pagination | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  scopeLoadingById: Record<string, boolean>;
  scopeErrorById: Record<string, string | null>;
};

const initialState: AdminRequestsState = {
  items: [],
  pagination: null,
  status: "idle",
  error: null,
  scopeLoadingById: {},
  scopeErrorById: {},
};

export const fetchAdminRequests = createAsyncThunk<
  FetchRequestsResponse,
  { page?: number; limit?: number } | undefined,
  { rejectValue: string }
>("adminRequests/fetch", async (params, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<FetchRequestsResponse>(
      "/pre-market/admin/requests",
      {
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unable to load requests.");
  }
});

type ToggleScopeResponse = {
  success: boolean;
  message: string;
  data: AdminRequest;
  timestamp: string;
};

export const toggleAdminRequestScope = createAsyncThunk<
  { id: string; data: AdminRequest },
  { id: string; scope: AdminRequestScope },
  { rejectValue: { id: string; message: string } }
>(
  "adminRequests/toggleScope",
  async ({ id, scope }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<ToggleScopeResponse>(
        `/pre-market/admin/requests/${id}/scope`,
        { scope },
      );
      return { id, data: response.data.data };
    } catch (error) {
      // Axios's default message ("Request failed with status code 400") is
      // unhelpful — prefer the backend's structured message when present.
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string } };
        message?: string;
      };
      const backendMessage
        = axiosError.response?.data?.message
          ?? axiosError.response?.data?.error;
      const message
        = backendMessage
          ?? axiosError.message
          ?? "Unable to update the request scope.";
      return rejectWithValue({ id, message });
    }
  },
);

const adminRequestsSlice = createSlice({
  name: "adminRequests",
  initialState,
  reducers: {
    clearScopeErrorForId(state, action: { payload: { id: string } }) {
      const { id } = action.payload;
      if (state.scopeErrorById[id]) {
        state.scopeErrorById[id] = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminRequests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Failed to load requests.";
      })
      .addCase(toggleAdminRequestScope.pending, (state, action) => {
        const { id } = action.meta.arg;
        state.scopeLoadingById[id] = true;
        state.scopeErrorById[id] = null;
      })
      .addCase(toggleAdminRequestScope.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.scopeLoadingById[id] = false;
        const index = state.items.findIndex((item) => item._id === id);
        if (index >= 0) {
          state.items[index] = {
            ...state.items[index],
            ...data,
          };
        }
      })
      .addCase(toggleAdminRequestScope.rejected, (state, action) => {
        const { id, message } = action.payload ?? {
          id: action.meta.arg.id,
          message: "Failed to update scope.",
        };
        state.scopeLoadingById[id] = false;
        state.scopeErrorById[id] = message;
      });
  },
});

export const { clearScopeErrorForId } = adminRequestsSlice.actions;

export const selectAdminRequests = (state: RootState) => state.adminRequests;
export default adminRequestsSlice.reducer;
