import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiClient } from "@/lib/apiClient";

export type AdminRequest = {
  _id: string;
  id: string;
  requestId: string;
  requestName: string;
  createdAt: string;
  status?: "Available" | "pending" | "paid" | "free" | "rejected";
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
};

const initialState: AdminRequestsState = {
  items: [],
  pagination: null,
  status: "idle",
  error: null,
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

const adminRequestsSlice = createSlice({
  name: "adminRequests",
  initialState,
  reducers: {},
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
      });
  },
});

export const selectAdminRequests = (state: RootState) => state.adminRequests;
export default adminRequestsSlice.reducer;
